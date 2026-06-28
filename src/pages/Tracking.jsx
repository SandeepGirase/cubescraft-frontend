import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axiosConfig";

function Tracking() {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [locationNames, setLocationNames] = useState({});
  const [locationLoading, setLocationLoading] = useState({});
  const locationCacheRef = useRef({});

  const fetchLocationName = useCallback(async (latitude, longitude) => {
    const key = `${latitude},${longitude}`;
    if (locationCacheRef.current[key]) {
      return locationCacheRef.current[key];
    }

    setLocationLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=${i18n.language}`
      );

      if (!response.ok) {
        throw new Error("Reverse geocode failed");
      }

      const data = await response.json();
      const placeName =
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.hamlet ||
        data.name ||
        data.display_name;

      const locationName = placeName || t("common.none");
      locationCacheRef.current[key] = locationName;
      return locationName;
    } catch {
      return t("common.none");
    } finally {
      setLocationLoading((prev) => ({ ...prev, [key]: false }));
    }
  }, [i18n.language, t]);

  const resolveLocationNames = useCallback(async (employeeList) => {
    const names = {};

    await Promise.all(
      employeeList.map(async (employee) => {
        if (employee.latitude && employee.longitude) {
          const key = `${employee.latitude},${employee.longitude}`;
          if (!locationCacheRef.current[key]) {
            names[key] = await fetchLocationName(employee.latitude, employee.longitude);
          } else {
            names[key] = locationCacheRef.current[key];
          }
        }
      })
    );

    setLocationNames((prev) => ({ ...prev, ...names }));
  }, [fetchLocationName]);

  const loadEmployees = useCallback(async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
      resolveLocationNames(response.data);
    } catch {
      setError(t("tracking.loadError"));
    }
  }, [resolveLocationNames, t]);

  useEffect(() => {
    const initialize = async () => {
      await loadEmployees();
    };

    initialize();
  }, [loadEmployees]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t("tracking.title")}</h1>
          <p>{t("tracking.description")}</p>
        </div>

        <button onClick={loadEmployees}>{t("tracking.refresh")}</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{t("tracking.locationStatus")}</h2>

        {employees.length === 0 ? (
          <p className="muted">{t("tracking.noEmployees")}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t("tracking.employee")}</th>
                <th>{t("employees.client")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.location")}</th>
                <th>{t("tracking.map")}</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => {
                const hasLocation = employee.latitude && employee.longitude;

                return (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.client?.name || t('common.none')}</td>
                    <td>
                      <span className={`badge ${employee.status?.toLowerCase()}`}>
                        {t(`employees.status.${employee.status}`, employee.status)}
                      </span>
                    </td>
                    <td>
                      {hasLocation ? (
                        locationLoading[`${employee.latitude},${employee.longitude}`] ? (
                          t("employees.loadingLocation")
                        ) : (
                          locationNames[`${employee.latitude},${employee.longitude}`] || t("common.none")
                        )
                      ) : (
                        t("common.none")
                      )}
                    </td>
                    <td>
                      {hasLocation ? (
                        <a
                          href={`https://www.google.com/maps?q=${employee.latitude},${employee.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("tracking.openMap")}
                        </a>
                      ) : (
                        t("tracking.noLocation")
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Tracking;