import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./Layout";


jest.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="outlet-mock">Outlet Mock</div>,
}));


jest.mock("../Header/Header", () => () => (
  <div data-testid="header-mock">Header Mock</div>
));

describe("Layout Component", () => {
  test("Debe mostrar Header y Outlet", () => {
    render(<Layout />);
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();
    expect(screen.getByTestId("outlet-mock")).toBeInTheDocument();
  });
});
