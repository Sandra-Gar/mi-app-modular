import { render, screen } from "@testing-library/react";
import Error404 from "./Error404";


jest.mock("react-router-dom", () => ({
  Link: ({ to, children, className }) => (
    <a href={to} className={className} data-testid="mock-link">
      {children}
    </a>
  ),
}));

describe("Error404 Component", () => {
  test("muestra el icono de error", () => {
    render(<Error404 />);
    expect(screen.getByText("⚠️")).toBeInTheDocument();
  });

  test("muestra el mensaje de error", () => {
    render(<Error404 />);
    expect(
      screen.getByText(/Lo sentimos\. Página no encontrada/i)
    ).toBeInTheDocument();
  });

  test("renderiza el enlace para volver al inicio", () => {
    render(<Error404 />);

    const link = screen.getByTestId("mock-link");

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent("Volver al inicio");
  });
});
