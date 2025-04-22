// src/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para mostrar un mensaje de error
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Registra el error en la consola (opcional)
    console.error("Error capturado por el Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar el mensaje de error aquí
      return (
        <div className="error-boundary">
          <h1>Algo salió mal.</h1>
          <p>Por favor, inténtalo de nuevo más tarde.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;