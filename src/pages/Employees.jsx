import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axiosConfig";

function Employees() {
  const { t, i18n } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [locationNames, setLocationNames] = useState({});
  const [locationLoading, setLocationLoading] = useState({});
  const locationCacheRef = useRef({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    clientId: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [filterClientId, setFilterClientId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = async () => {
    const response = await api.get("/clients");
    setClients(response.data);
  };

  const fetchLocationName = async (latitude, longitude) => {
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
    } catch (error) {
      return t("common.none");
    } finally {
      setLocationLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const resolveLocationNames = async (employeeList) => {
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
  };

  const loadEmployees = async () => {
    try {
      const url = filterClientId
        ? `/employees?clientId=${filterClientId}`
        : "/employees";

      const response = await api.get(url);
      setEmployees(response.data);
      resolveLocationNames(response.data);
    } catch (error) {
      setError(t("employees.loadError"));
    }
  };

  const loadData = async () => {
    try {
      await Promise.all([loadClients(), loadEmployees()]);
    } catch (error) {
      setError(t("employees.loadError"));
    }
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      designation: "",
      clientId: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        clientId: Number(form.clientId),
      };

      if (editingId) {
        await api.put(`/employees/${editingId}`, payload);
        setMessage(t("employees.updatedSuccess"));
      } else {
        await api.post("/employees", payload);
        setMessage(t("employees.createdSuccess"));
      }

      resetForm();
      loadEmployees();
    } catch (error) {
      setError(error.response?.data?.message || t("employees.saveError"));
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      designation: employee.designation || "",
      clientId: employee.client?.id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("employees.deleteConfirm"))) {
      return;
    }

    try {
      await api.delete(`/employees/${id}`);
      setMessage(t("employees.deletedSuccess"));
      loadEmployees();
    } catch (error) {
      setError(t("employees.deleteError"));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/employees/${id}/status`, { status });
      setMessage(t("employees.statusUpdated"));
      loadEmployees();
    } catch (error) {
      setError(t("employees.statusError"));
    }
  };

  const updateMyLocation = async (employeeId) => {
    if (!navigator.geolocation) {
      setError(t("employees.geolocationNotSupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.put(`/employees/${employeeId}/location`, {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          setMessage(t("employees.locationUpdated"));
          loadEmployees();
        } catch (error) {
          setError(t("employees.locationError"));
        }
      },
      () => {
        setError(t("employees.locationPermissionDenied"));
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [filterClientId]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t("employees.title")}</h1>
          <p>{t("employees.description")}</p>
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{editingId ? t("employees.updateEmployee") : t("employees.addEmployee")}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>{t("employees.employeeName")}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("employees.employeeNamePlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("employees.email")}</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t("employees.emailPlaceholder")}
            />
          </div>

          <div className="form-group">
            <label>{t("employees.phone")}</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={t("employees.phonePlaceholder")}
            />
          </div>

          <div className="form-group">
            <label>{t("employees.designation")}</label>
            <input
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder={t("employees.designationPlaceholder")}
            />
          </div>

          <div className="form-group">
            <label>{t("employees.client")}</label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
            >
              <option value="">{t("employees.selectClient")}</option>

              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? t("employees.updateEmployeeBtn") : t("employees.createEmployee")}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                {t("common.cancel")}
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>{t("employees.employeeList")}</h2>

          <select
            value={filterClientId}
            onChange={(event) => setFilterClientId(event.target.value)}
          >
            <option value="">{t("employees.allClients")}</option>

            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {employees.length === 0 ? (
          <p className="muted">{t("employees.noEmployees")}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t("common.name")}</th>
                <th>{t("employees.client")}</th>
                <th>{t("employees.email")}</th>
                <th>{t("employees.phone")}</th>
                <th>{t("employees.designation")}</th>
                <th>{t("common.status")}</th>
                <th>{t("common.location", "Location")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.client?.name || t('common.none')}</td>
                  <td>{employee.email || t('common.none')}</td>
                  <td>{employee.phone || t('common.none')}</td>
                  <td>{employee.designation || t('common.none')}</td>
                  <td>
                    <span className={`badge ${employee.status?.toLowerCase()}`}>
                      {t(`employees.status.${employee.status}`, employee.status)}
                    </span>
                  </td>
                  <td>
                    {employee.latitude && employee.longitude ? (
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
                    <button className="small" onClick={() => handleEdit(employee)}>
                      {t("common.edit")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateStatus(employee.id, "AVAILABLE")}
                    >
                      {t("employees.available")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateStatus(employee.id, "OFFLINE")}
                    >
                      {t("employees.offline")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateMyLocation(employee.id)}
                    >
                      {t("employees.updateLocation")}
                    </button>

                    <button
                      className="small danger"
                      onClick={() => handleDelete(employee.id)}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Employees;