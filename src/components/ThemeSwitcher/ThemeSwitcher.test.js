import { render, screen, fireEvent } from "@testing-library/react";
import ThemeSwitcher from "./ThemeSwitcher";
import ThemeContext from "../../context/ThemeContext";

// Mock de los íconos
jest.mock("../Icons/IconMoon", () => () => <div data-testid="icon-moon" />);
jest.mock("../Icons/IconSun", () => () => <div data-testid="icon-sun" />);

describe("ThemeSwitcher Component", () => {
  test("muestra el ícono de la luna cuando el tema es 'light'", () => {
    const mockToggle = jest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: mockToggle }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId("icon-moon")).toBeInTheDocument();
  });

  test("muestra el ícono del sol cuando el tema es 'dark'", () => {
    const mockToggle = jest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme: mockToggle }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId("icon-sun")).toBeInTheDocument();
  });

  test("ejecuta toggleTheme cuando se hace click", () => {
    const mockToggle = jest.fn();

    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: mockToggle }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
