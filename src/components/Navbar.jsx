import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>{t('navbar.brand')}</h2>
        <p>{t('navbar.subtitle')}</p>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end>
          {t('navbar.dashboard')}
        </NavLink>

        <NavLink to="/clients">
          {t('navbar.clients')}
        </NavLink>

        <NavLink to="/employees">
          {t('navbar.employees')}
        </NavLink>

        <NavLink to="/tasks">
          {t('navbar.tasks')}
        </NavLink>

        <NavLink to="/tracking">
          {t('navbar.tracking')}
        </NavLink>
      </nav>
    </aside>
  );
}

export default Navbar;