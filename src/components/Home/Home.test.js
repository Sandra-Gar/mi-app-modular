import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Componente Home', () => {
  test('renderiza el componente Home sin errores', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  test('muestra el encabezado de bienvenida', () => {
    render(<Home />);
    expect(screen.getByText('Bienvenido a la Aplicación de Demostración')).toBeInTheDocument();
  });

  test('muestra el texto de descripción', () => {
    render(<Home />);
    expect(screen.getByText(/Usa la navegación de arriba para visitar/i)).toBeInTheDocument();
  });

  test('menciona el directorio y la lista de tareas en la descripción', () => {
    render(<Home />);
    const description = screen.getByText(/Usa la navegación de arriba para visitar/i);
    expect(description).toBeInTheDocument();
  });

  test('renderiza un elemento párrafo', () => {
    render(<Home />);
    const paragraph = screen.getByText(/Usa la navegación de arriba para visitar/i).closest('p');
    expect(paragraph).toBeInTheDocument();
  });
});
