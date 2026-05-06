import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingProvider from "./context/LoadingContext";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";
import Tracking from "./pages/Tracking";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </LoadingProvider>
  );
}

function NotFound() {
  return (
    <div style={styles.notFoundContainer}>
      <h1 style={styles.notFoundTitle}>404</h1>
      <p style={styles.notFoundMessage}>Page not found</p>
      <a href="/" style={styles.notFoundLink}>Go to Dashboard</a>
    </div>
  );
}

const styles = {
  notFoundContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
    textAlign: 'center',
  },
  notFoundTitle: {
    fontSize: '64px',
    color: '#d32f2f',
    margin: 0,
  },
  notFoundMessage: {
    fontSize: '20px',
    color: '#666',
    marginTop: '16px',
  },
  notFoundLink: {
    marginTop: '24px',
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default App;