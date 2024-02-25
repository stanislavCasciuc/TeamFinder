import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import "./App.css";
import LandingPage from "./Pages/LandingPage";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <MantineProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </MantineProvider>
    </Router>
  );
}
