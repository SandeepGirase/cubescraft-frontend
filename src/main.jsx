import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import setupGlobalErrorHandlers from "./utils/globalErrorHandler.js";
import "./index.css";
import "./App.css";
import "./i18n.js";

// Setup global error handlers
setupGlobalErrorHandlers();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
