import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeContext, { ThemeProvider } from './ThemeContext';

const TestConsumer = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Cambiar Tema</button>
    </div>
  );
};

describe('ThemeContext', () => {
  test('proporciona el tema inicial como "light"', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('cambia de "light" a "dark" al llamar toggleTheme', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /Cambiar Tema/i });
    
    // Estado inicial
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    // Cambiar a dark
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('cambia de "dark" a "light" al llamar toggleTheme nuevamente', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /Cambiar Tema/i });
    
    // Cambiar a dark
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    // Cambiar de vuelta a light
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('alterna entre temas múltiples veces', () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /Cambiar Tema/i });
    
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    
    fireEvent.click(button);
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('comparte el estado entre múltiples consumidores', () => {
    const Consumer1 = () => {
      const { theme } = useContext(ThemeContext);
      return <div data-testid="consumer-1">{theme}</div>;
    };

    const Consumer2 = () => {
      const { theme, toggleTheme } = useContext(ThemeContext);
      return (
        <div>
          <div data-testid="consumer-2">{theme}</div>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <Consumer1 />
        <Consumer2 />
      </ThemeProvider>
    );


    expect(screen.getByTestId('consumer-1')).toHaveTextContent('light');
    expect(screen.getByTestId('consumer-2')).toHaveTextContent('light');

   
    const button = screen.getByRole('button', { name: /Toggle/i });
    fireEvent.click(button);

    expect(screen.getByTestId('consumer-1')).toHaveTextContent('dark');
    expect(screen.getByTestId('consumer-2')).toHaveTextContent('dark');
  });

  test('renderiza children correctamente', () => {
    render(
      <ThemeProvider>
        <div data-testid="child-element">Contenido hijo</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Contenido hijo')).toBeInTheDocument();
  });

  test('proporciona toggleTheme como función', () => {
    const TestComponent = () => {
      const { toggleTheme } = useContext(ThemeContext);
      return <div>{typeof toggleTheme}</div>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByText('function')).toBeInTheDocument();
  });

  test('el contexto tiene valores por defecto cuando no hay Provider', () => {
    const TestWithoutProvider = () => {
      const { theme, toggleTheme } = useContext(ThemeContext);
      return (
        <div>
          <div data-testid="default-theme">{theme}</div>
          <div data-testid="toggle-type">{typeof toggleTheme}</div>
        </div>
      );
    };

    render(<TestWithoutProvider />);

    expect(screen.getByTestId('default-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('toggle-type')).toHaveTextContent('function');
  });

  test('permite anidar múltiples providers', () => {
    const OuterConsumer = () => {
      const { theme } = useContext(ThemeContext);
      return <div data-testid="outer-theme">{theme}</div>;
    };

    render(
      <ThemeProvider>
        <OuterConsumer />
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      </ThemeProvider>
    );

    // Ambos providers tienen su propio estado independiente
    expect(screen.getByTestId('outer-theme')).toHaveTextContent('light');
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('mantiene el estado al re-renderizar children', () => {
    const DynamicChildren = ({ show }) => {
      const { theme } = useContext(ThemeContext);
      return show ? <div data-testid="dynamic-child">{theme}</div> : null;
    };

    const TestWrapper = () => {
      const [show, setShow] = React.useState(true);
      const { toggleTheme } = useContext(ThemeContext);
      
      return (
        <>
          <DynamicChildren show={show} />
          <button onClick={toggleTheme}>Toggle Theme</button>
          <button onClick={() => setShow(!show)}>Toggle Show</button>
        </>
      );
    };

    render(
      <ThemeProvider>
        <TestWrapper />
      </ThemeProvider>
    );

    // Cambiar el tema
    fireEvent.click(screen.getByRole('button', { name: /Toggle Theme/i }));
    expect(screen.getByTestId('dynamic-child')).toHaveTextContent('dark');

    // Ocultar y mostrar el hijo
    fireEvent.click(screen.getByRole('button', { name: /Toggle Show/i }));
    expect(screen.queryByTestId('dynamic-child')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Toggle Show/i }));
    
    expect(screen.getByTestId('dynamic-child')).toHaveTextContent('dark');
  });
});