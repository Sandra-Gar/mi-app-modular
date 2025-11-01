import React from 'react';
import './Error404.css';
import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">Lo sentimos. Página no encontrada</p>
      <Link to="/" className="home-link">Volver al inicio</Link>
    </div>
  );
};

export default Error404;
