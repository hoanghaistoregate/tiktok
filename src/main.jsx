import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { SongsProvider } from "./context/SongsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SongsProvider>
          <App />
        </SongsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
