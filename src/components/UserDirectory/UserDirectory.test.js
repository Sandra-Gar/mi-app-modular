import { render, screen } from "@testing-library/react";
import UserDirectory from "./UserDirectory";


global.fetch = jest.fn();

describe("UserDirectory Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("muestra mensaje de carga inicialmente", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<UserDirectory />);

    expect(screen.getByText(/Cargando usuarios/i)).toBeInTheDocument();
  });

  test("muestra la lista de usuarios cuando fetch es exitoso", async () => {
    const mockUsers = [
      { id: 1, name: "Juan Pérez", email: "juan@test.com", website: "juan.com" },
      { id: 2, name: "Ana López", email: "ana@test.com", website: "ana.com" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    render(<UserDirectory />);

    // Esto espera automáticamente el cambio de estado (act incluido)
    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();
    expect(await screen.findByText("Ana López")).toBeInTheDocument();
  });

  test("muestra un mensaje de error cuando fetch falla", async () => {
    fetch.mockRejectedValueOnce(new Error("Error de conexión"));

    render(<UserDirectory />);

    expect(await screen.findByText(/Error: Error de conexión/i))
      .toBeInTheDocument();
  });
});
