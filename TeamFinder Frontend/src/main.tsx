import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./App.css";
import { AuthProvider } from "./context/AuthProvider";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <MantineProvider>
        <ModalsProvider>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
    </Router>
  </React.StrictMode>
);
