import { render, screen } from "@testing-library/react";
import Header from "./Header";

// Mock del componente ThemeSwitcher
jest.mock("../ThemeSwitcher/ThemeSwitcher", () => () => (
  <div data-testid="theme-switcher-mock">ThemeSwitcher Mock</div>
));

// Mock de react-router-dom (solo Link)
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => (
    <a href={to} data-testid={`link-${children.toLowerCase()}`}>
      {children}
    </a>
  ),
}));

// Mock del IconApp
jest.mock("../Icons/icon.js", () => () => (
  <div data-testid="icon-app-mock">IconApp Mock</div>
));

describe("Header Component", () => {
  test("renderiza el encabezado y elementos principales", () => {
    render(<Header />);

    // Encabezado
    expect(screen.getByRole("banner")).toBeInTheDocument();

    // Icono de la app
    expect(screen.getByTestId("icon-app-mock")).toBeInTheDocument();

    // ThemeSwitcher mock
    expect(screen.getByTestId("theme-switcher-mock")).toBeInTheDocument();
  });

  test("renderiza los enlaces de navegación correctamente", () => {
    render(<Header />);

    const linkInicio = screen.getByTestId("link-inicio");
    const linkTareas = screen.getByTestId("link-tareas");
    const linkDirectorio = screen.getByTestId("link-directorio");

    expect(linkInicio).toHaveAttribute("href", "/");
    expect(linkTareas).toHaveAttribute("href", "/tareas");
    expect(linkDirectorio).toHaveAttribute("href", "/directorio");
  });

  test("muestra el componente ThemeSwitcher (mock)", () => {
    render(<Header />);
    expect(screen.getByTestId("theme-switcher-mock")).toBeInTheDocument();
  });
});
