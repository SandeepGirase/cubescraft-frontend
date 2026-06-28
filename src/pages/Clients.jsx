import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axiosConfig";

function Clients() {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch {
      setError(t("clients.loadError"));
    }
  }, [t]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/clients/${editingId}`, form);
        setMessage(t("clients.updatedSuccess"));
      } else {
        await api.post("/clients", form);
        setMessage(t("clients.createdSuccess"));
      }

      resetForm();
      loadClients();
    } catch (error) {
      setError(error.response?.data?.message || t("clients.saveError"));
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setForm({
      name: client.name || "",
      description: client.description || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("clients.deleteConfirm"))) {
      return;
    }

    try {
      await api.delete(`/clients/${id}`);
      setMessage(t("clients.deletedSuccess"));
      loadClients();
    } catch {
      setError(t("clients.deleteError"));
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadClients();
    };

    initialize();
  }, [loadClients]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{t("clients.title")}</h1>
          <p>{t("clients.description")}</p>
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>{editingId ? t("clients.updateClient") : t("clients.addClient")}</h2>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>{t("clients.clientName")}</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("clients.clientNamePlaceholder")}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("common.description")}</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("clients.descriptionPlaceholder")}
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? t("clients.updateClientBtn") : t("clients.createClient")}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>{t("clients.clientList")}</h2>

        {clients.length === 0 ? (
          <p className="muted">{t("clients.noClients")}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t("common.id")}</th>
                <th>{t("common.name")}</th>
                <th>{t("common.description")}</th>
                <th>{t("common.created")}</th>
                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.description || t('common.none')}</td>
                  <td>{client.createdAt?.substring(0, 10) || t('common.none')}</td>
                  <td>
                    <button className="small" onClick={() => handleEdit(client)}>
                      {t("common.edit")}
                    </button>

                    <button
                      className="small danger"
                      onClick={() => handleDelete(client.id)}
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

export default Clients;