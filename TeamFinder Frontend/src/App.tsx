import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";

import "./App.css";

import LandingPage from "./Pages/LandingPage";

export default function App() {
  return <MantineProvider>{<LandingPage />}</MantineProvider>;
}
