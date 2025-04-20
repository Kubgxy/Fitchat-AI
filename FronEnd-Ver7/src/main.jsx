import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./components/AuthContext.jsx";
import { ThemeProvider } from "./components/ThemeContext.jsx";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
