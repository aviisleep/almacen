// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ErrorBoundary from "./ErrorBoundary"; // Importa el ErrorBoundary

function App() {
  return (
    <div>
      {/* Envuelve todo el contenido con el ErrorBoundary */}
      <ErrorBoundary>
          <Routes>
            {/* Solo una ruta principal */}
            <Route path="/" element={<Home />} />
          </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;