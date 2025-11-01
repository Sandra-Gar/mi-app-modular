import React from 'react';

const Welcome = ({ nombre }) => {
  return (
    <div>
      <h2>Bienvenido, {nombre}!</h2>
      <p>Este es un ejemplo de un componente modularizado.</p>
    </div>
  );
};

export default Welcome;
