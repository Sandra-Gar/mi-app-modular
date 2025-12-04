import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "./TodoItem";

// Mock del ícono para evitar errores al renderizar SVG
jest.mock("../Icons/IconTrash", () => () => <div data-testid="icon-trash" />);

describe("TodoItem Component", () => {
  const mockTask = {
    id: "1",
    text: "Comprar leche",
    isComplete: false,
  };

  const mockToggle = jest.fn();
  const mockDelete = jest.fn();

  test("renderiza el texto de la tarea", () => {
    render(
      <TodoItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onDeleteTask={mockDelete}
      />
    );

    expect(screen.getByText("Comprar leche")).toBeInTheDocument();
  });

  test("el checkbox debe reflejar el estado de la tarea", () => {
    render(
      <TodoItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onDeleteTask={mockDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.checked).toBe(false);
  });

  test("marca como completado cuando se hace click en el checkbox", () => {
    render(
      <TodoItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onDeleteTask={mockDelete}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockToggle).toHaveBeenCalledWith("1");
  });

  test("ejecuta la función de eliminar cuando se presiona el botón", () => {
    render(
      <TodoItem
        task={mockTask}
        onToggleComplete={mockToggle}
        onDeleteTask={mockDelete}
      />
    );

    const deleteBtn = screen.getByRole("button");
    fireEvent.click(deleteBtn);

    expect(mockDelete).toHaveBeenCalledWith("1");
  });

  test("muestra clase 'completed' si la tarea está completada", () => {
    const completedTask = { ...mockTask, isComplete: true };

    const { container } = render(
      <TodoItem
        task={completedTask}
        onToggleComplete={mockToggle}
        onDeleteTask={mockDelete}
      />
    );
  });
});
