import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axiosConfig";

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    clients: 0,
    employees: 0,
    tasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    availableEmployees: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const [clientsResponse, employeesResponse, tasksResponse] =
        await Promise.all([
          api.get("/clients"),
          api.get("/employees"),
          api.get("/tasks"),
        ]);

      const clients = clientsResponse.data;
      const employees = employeesResponse.data;
      const tasks = tasksResponse.data;

      setStats({
        clients: clients.length,
        employees: employees.length,
        tasks: tasks.length,
        pendingTasks: tasks.filter((task) => task.status === "PENDING").length,
        completedTasks: tasks.filter((task) => task.status === "COMPLETED").length,
        availableEmployees: employees.filter(
          (employee) => employee.status === "AVAILABLE"
        ).length,
      });

      setRecentTasks(tasks.slice(-5).reverse());
    } catch {
      setError(t("dashboard.loadError"));
    }
  }, [t]);

  useEffect(() => {
    const initialize = async () => {
      await loadDashboard();
    };

    initialize();
  }, [loadDashboard]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t("dashboard.title")}</h1>
          <p>{t("dashboard.description")}</p>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>{t("dashboard.clients")}</span>
          <strong>{stats.clients}</strong>
        </div>

        <div className="stat-card">
          <span>{t("dashboard.employees")}</span>
          <strong>{stats.employees}</strong>
        </div>

        <div className="stat-card">
          <span>{t("dashboard.totalTasks")}</span>
          <strong>{stats.tasks}</strong>
        </div>

        <div className="stat-card">
          <span>{t("dashboard.pendingTasks")}</span>
          <strong>{stats.pendingTasks}</strong>
        </div>

        <div className="stat-card">
          <span>{t("dashboard.completedTasks")}</span>
          <strong>{stats.completedTasks}</strong>
        </div>

        <div className="stat-card">
          <span>{t("dashboard.availableEmployees")}</span>
          <strong>{stats.availableEmployees}</strong>
        </div>
      </div>

      <section className="card">
        <h2>{t("dashboard.recentTasks")}</h2>

        {recentTasks.length === 0 ? (
          <p className="muted">{t("dashboard.noTasks")}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('common.title')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.priority')}</th>
                <th>{t('common.dueDate')}</th>
              </tr>
            </thead>

            <tbody>
              {recentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <span className={`badge ${task.status?.toLowerCase()}`}>
                      {t(`tasks.status.${task.status}`, task.status)}
                    </span>
                  </td>
                  <td>{t(`tasks.priorityLevels.${task.priority}`, task.priority)}</td>
                  <td>{task.dueDate || t('common.none')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;