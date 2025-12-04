import { render, screen } from "@testing-library/react";
import Welcome from "./Welcome";

describe("Welcome Component", () => {
  test("renderiza el título correctamente con el nombre", () => {
    render(<Welcome nombre="Sandra" />);
    expect(screen.getByText("Bienvenido, Sandra!")).toBeInTheDocument();
  });
});
