import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ThemeContext from "./context/ThemeContext";
import App from "./App";

test("renderiza el texto principal del Home", () => {

  const mockTheme = { theme: "light" };

  render(
    <ThemeContext.Provider value={mockTheme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContext.Provider>
  );

  const homeText = screen.getByText(/Bienvenido a la Aplicación de Demostración/i);
  expect(homeText).toBeInTheDocument();
});
