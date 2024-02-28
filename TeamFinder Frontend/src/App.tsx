import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "./App.css";
import LandingPage from "./Pages/LandingPage";
import RegisterPage from "./Pages/RegisterPage";
import RegisterEmployee from "./Pages/RegisterEmployee";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import LoginPage from "./Pages/Login";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import Missing from "./Pages/Missing";

export default function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Not protected Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/Register" element={<RegisterPage />} />
          <Route
            path="/Register/:Organization_name/Employee"
            element={<RegisterEmployee />}
          />
          <Route path="/Login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  "organization_admin",
                  "departament_Manager",
                  "project_Manager",
                  "employee",
                ]}
              />
            }
          >
            <Route path="/HomePage/:accessToken" element={<HomePage />} />
          </Route>

          {/* catch All */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </MantineProvider>
  );
}
