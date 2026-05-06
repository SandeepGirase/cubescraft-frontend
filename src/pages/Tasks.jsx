import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axiosConfig";

function Tasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    priority: "MEDIUM",
    dueDate: "",
    clientId: "",
    employeeId: "",
  });
  const [autoAssign, setAutoAssign] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = async () => {
    const response = await api.get("/clients");
    setClients(response.data);
  };

  const loadEmployees = async () => {
    const response = await api.get("/employees");
    setEmployees(response.data);
  };

  const loadTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);

      const url = params.toString() ? `/tasks?${params.toString()}` : "/tasks";
      const response = await api.get(url);
      setTasks(response.data);
    } catch (error) {
      setError(t("tasks.loadError"));
    }
  };

  const loadData = async () => {
    try {
      await Promise.all([loadClients(), loadEmployees(), loadTasks()]);
    } catch (error) {
      setError(t("tasks.loadError"));
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
      title: "",
      description: "",
      address: "",
      priority: "MEDIUM",
      dueDate: "",
      clientId: "",
      employeeId: "",
    });
    setAutoAssign(true);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        address: form.address,
        priority: form.priority,
        dueDate: form.dueDate || null,
        clientId: Number(form.clientId),
        employeeId: form.employeeId ? Number(form.employeeId) : null,
      };

      if (editingId) {
        await api.put(`/tasks/${editingId}`, payload);
        setMessage(t("tasks.updatedSuccess"));
      } else {
        await api.post("/tasks", payload);
        setMessage(t("tasks.createdSuccess"));
      }

      resetForm();
      loadTasks();
      loadEmployees();
    } catch (error) {
      setError(error.response?.data?.message || t("tasks.saveError"));
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setAutoAssign(!task.employee?.id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      address: task.address || "",
      priority: task.priority || "MEDIUM",
      dueDate: task.dueDate || "",
      clientId: task.client?.id || "",
      employeeId: task.employee?.id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("tasks.deleteConfirm"))) {
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      setMessage(t("tasks.deletedSuccess"));
      loadTasks();
    } catch (error) {
      setError(t("tasks.deleteError"));
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      setMessage(t("tasks.statusUpdated"));
      loadTasks();
      loadEmployees();
    } catch (error) {
      setError(t("tasks.statusError"));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("tasksFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFilterStatus(parsed.status || "");
        setFilterPriority(parsed.priority || "");
      } catch (err) {
        console.warn("Failed to parse saved task filters", err);
      }
    }

    loadClients();
    loadEmployees();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filterStatus, filterPriority]);

  useEffect(() => {
    localStorage.setItem(
      "tasksFilters",
      JSON.stringify({ status: filterStatus, priority: filterPriority })
    );
  }, [filterStatus, filterPriority]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t("tasks.title")}</h1>
          <p>{t("tasks.description")}</p>
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{editingId ? t("tasks.updateTask") : t("tasks.createTask")}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>{t("tasks.taskTitle")}</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t("tasks.taskTitlePlaceholder")}
              required
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

          <div className="form-group">
            <label>{t("tasks.assignEmployee")}</label>
            <select
              name="employeeId"
              value={form.employeeId}
              onChange={handleChange}
            >
              <option value="">{t("tasks.keepPending")}</option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.client?.name || t("common.none")}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(event) => setAutoAssign(event.target.checked)}
              />
              {t("tasks.autoAssignLabel")}
            </label>
            <p className="help-text">{t("tasks.autoAssignHelp")}</p>
          </div>


          <div className="form-group">
            <label>{t("tasks.priority")}</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">{t("tasks.low")}</option>
              <option value="MEDIUM">{t("tasks.medium")}</option>
              <option value="HIGH">{t("tasks.high")}</option>
              <option value="URGENT">{t("tasks.urgent")}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t("tasks.dueDate")}</label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full">
            <label>{t("tasks.address")}</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder={t("tasks.addressPlaceholder")}
            />
          </div>

          <div className="form-group full">
            <label>{t("common.description")}</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("tasks.taskDetailsPlaceholder")}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? t("tasks.updateTaskBtn") : t("tasks.createTaskBtn")}
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
          <h2>{t("tasks.taskList")}</h2>

          <div className="filter-badges">
            {filterStatus && (
              <span className={`badge ${filterStatus.toLowerCase()}`}>
                {t(`tasks.status.${filterStatus}`)}
              </span>
            )}
            {filterPriority && (
              <span className={`badge priority-${filterPriority.toLowerCase()}`}>
                {t(`tasks.priorityLevels.${filterPriority}`)}
              </span>
            )}
          </div>

          <select
            value={filterStatus}
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="">{t("tasks.allStatus")}</option>
            <option value="PENDING">{t("tasks.pending")}</option>
            <option value="ASSIGNED">{t("tasks.assigned")}</option>
            <option value="IN_PROGRESS">{t("tasks.inProgress")}</option>
            <option value="COMPLETED">{t("tasks.completed")}</option>
            <option value="CANCELLED">{t("tasks.cancelled")}</option>
          </select>

          <select
            value={filterPriority}
            onChange={(event) => setFilterPriority(event.target.value)}
          >
            <option value="">{t("tasks.allPriorities")}</option>
            <option value="LOW">{t("tasks.low")}</option>
            <option value="MEDIUM">{t("tasks.medium")}</option>
            <option value="HIGH">{t("tasks.high")}</option>
            <option value="URGENT">{t("tasks.urgent")}</option>
          </select>
        </div>

        {tasks.length === 0 ? (
          <p className="muted">{t("tasks.noTasks")}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t("common.title")}</th>
                <th>{t("employees.client")}</th>
                <th>{t("employees.employeeName")}</th>
                <th>{t("common.status")}</th>
                <th>{t("tasks.priority")}</th>
                <th>{t("common.dueDate")}</th>
                <th>{t("tasks.assignmentType")}</th>
                <th>{t("tasks.distance")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.client?.name || t('common.none')}</td>
                  <td>{task.employee?.name || t("tasks.unassigned")}</td>
                  <td>
                    <span className={`badge ${task.status?.toLowerCase()}`}>
                      {t(`tasks.status.${task.status}`, task.status)}
                    </span>
                  </td>
                  <td>{t(`tasks.priorityLevels.${task.priority}`, task.priority)}</td>
                  <td>{task.dueDate || t('common.none')}</td>
                  <td>
                    {task.autoAssigned
                      ? t("tasks.autoAssigned")
                      : task.employee
                      ? t("tasks.manualAssignment")
                      : t("tasks.unassigned")}
                  </td>
                  <td>
                    {task.distanceKm != null
                      ? `${task.distanceKm.toFixed(1)} km`
                      : t("common.none")}
                  </td>
                  <td>
                    <button className="small" onClick={() => handleEdit(task)}>
                      {t("common.edit")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateTaskStatus(task.id, "IN_PROGRESS")}
                    >
                      {t("tasks.start")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                    >
                      {t("tasks.complete")}
                    </button>

                    <button
                      className="small"
                      onClick={() => updateTaskStatus(task.id, "CANCELLED")}
                    >
                      {t("common.cancel")}
                    </button>

                    <button
                      className="small danger"
                      onClick={() => handleDelete(task.id)}
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

export default Tasks;