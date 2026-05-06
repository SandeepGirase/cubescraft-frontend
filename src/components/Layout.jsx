import Navbar from "./Navbar";
import { useTranslation } from "react-i18next";

function Layout({ children }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="main-wrapper">
        <header className="top-header">
          <div className="language-switcher">
            <label>{t('common.language')}:</label>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">{t('common.english')}</option>
              <option value="de">{t('common.german')}</option>
            </select>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;