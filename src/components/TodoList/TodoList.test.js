import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from './TodoList';
import { onSnapshot, addDoc, updateDoc } from 'firebase/firestore';

jest.mock('../../firebaseConfig', () => ({
  db: {}
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date())
}));

describe('TodoList', () => {
  let unsubscribe;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock del unsubscribe
    unsubscribe = jest.fn();
    
    // Mock por defecto de onSnapshot (sin tareas)
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {}
      });
      return unsubscribe;
    });
  });

  test('renderiza el componente con título', () => {
    render(<TodoList />);
    expect(screen.getByText('Mi Lista de Tareas')).toBeInTheDocument();
  });

  test('renderiza la lista de tareas', () => {
    render(<TodoList />);
    expect(screen.getByText('Tareas')).toBeInTheDocument();
  });

  test('muestra el campo de entrada y botón', () => {
    render(<TodoList />);
    expect(screen.getByPlaceholderText(/Añade una nueva tarea/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir/i })).toBeInTheDocument();
  });

  test('muestra el botón para ver historial', () => {
    render(<TodoList />);
    expect(screen.getByText(/Ver historial/i)).toBeInTheDocument();
  });

  test('muestra "No hay tareas registradas" cuando no hay tareas', () => {
    render(<TodoList />);
    expect(screen.getByText('No hay tareas registradas.')).toBeInTheDocument();
  });

  test('renderiza botones de completar y eliminar para cada tarea', () => {
    // Mock con tareas
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea 1',
              isComplete: false,
              isDeleted: false,
              createdAt: new Date()
            })
          });
          fn({
            id: '2',
            data: () => ({
              text: 'Tarea 2',
              isComplete: false,
              isDeleted: false,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();

    // Verifica botones de eliminar
    const deleteButtons = screen.getAllByText('🗑');
    expect(deleteButtons).toHaveLength(2);

    // Verifica botones de completar
    const completeButtons = screen.getAllByRole('button').filter(btn => 
      btn.className.includes('complete-btn')
    );
    expect(completeButtons).toHaveLength(2);
  });

  test('permite añadir una nueva tarea', async () => {
    addDoc.mockResolvedValue({ id: 'new-task-id' });

    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Añade una nueva tarea/i);
    const addButton = screen.getByRole('button', { name: /Añadir/i });

    fireEvent.change(input, { target: { value: 'Nueva tarea' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          text: 'Nueva tarea',
          isComplete: false,
          isDeleted: false
        })
      );
    });
  });

  test('no añade tarea si el input está vacío', async () => {
    render(<TodoList />);

    const addButton = screen.getByRole('button', { name: /Añadir/i });
    fireEvent.click(addButton);

    expect(addDoc).not.toHaveBeenCalled();
  });

  test('marca una tarea como completada', async () => {
    updateDoc.mockResolvedValue({});

    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea 1',
              isComplete: false,
              isDeleted: false,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    const completeButton = screen.getAllByRole('button').find(btn => 
      btn.className.includes('complete-btn')
    );

    fireEvent.click(completeButton);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        undefined,
        { isComplete: true }
      );
    });
  });

  test('elimina una tarea (marca como eliminada)', async () => {
    updateDoc.mockResolvedValue({});

    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea 1',
              isComplete: false,
              isDeleted: false,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    const deleteButton = screen.getByText('🗑');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(
        undefined,
        { isDeleted: true }
      );
    });
  });

  test('cambia entre vista de tareas y historial', () => {
    render(<TodoList />);

    const toggleButton = screen.getByText(/Ver historial/i);
    expect(toggleButton).toBeInTheDocument();

    // Cambiar a vista de historial
    fireEvent.click(toggleButton);
    expect(screen.getByText('Historial')).toBeInTheDocument();
    expect(screen.getByText(/Volver a tareas/i)).toBeInTheDocument();

    // Volver a vista de tareas
    fireEvent.click(screen.getByText(/Volver a tareas/i));
    expect(screen.getByText('Tareas')).toBeInTheDocument();
  });

  test('muestra tareas completadas en el historial', () => {
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea completada',
              isComplete: true,
              isDeleted: false,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    // Ir al historial
    const toggleButton = screen.getByText(/Ver historial/i);
    fireEvent.click(toggleButton);

    expect(screen.getByText('Tareas completadas ✅')).toBeInTheDocument();
    expect(screen.getByText('Tarea completada')).toBeInTheDocument();
  });

  test('muestra tareas eliminadas en el historial', () => {
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea eliminada',
              isComplete: false,
              isDeleted: true,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    // Ir al historial
    const toggleButton = screen.getByText(/Ver historial/i);
    fireEvent.click(toggleButton);

    expect(screen.getByText('Tareas eliminadas 🗑')).toBeInTheDocument();
    expect(screen.getByText('Tarea eliminada')).toBeInTheDocument();
  });

  test('limpia el input después de añadir una tarea', async () => {
    addDoc.mockResolvedValue({ id: 'new-task-id' });

    render(<TodoList />);

    const input = screen.getByPlaceholderText(/Añade una nueva tarea/i);
    fireEvent.change(input, { target: { value: 'Nueva tarea' } });
    
    expect(input.value).toBe('Nueva tarea');

    const addButton = screen.getByRole('button', { name: /Añadir/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('se desuscribe al desmontar el componente', () => {
    const { unmount } = render(<TodoList />);
    
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  test('filtra correctamente las tareas no eliminadas', () => {
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea visible',
              isComplete: false,
              isDeleted: false,
              createdAt: new Date()
            })
          });
          fn({
            id: '2',
            data: () => ({
              text: 'Tarea eliminada',
              isComplete: false,
              isDeleted: true,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    render(<TodoList />);

    expect(screen.getByText('Tarea visible')).toBeInTheDocument();
    expect(screen.queryByText('Tarea eliminada')).not.toBeInTheDocument();
  });

  test('aplica la clase "completed" a tareas completadas', () => {
    onSnapshot.mockImplementation((q, callback) => {
      callback({
        forEach: (fn) => {
          fn({
            id: '1',
            data: () => ({
              text: 'Tarea completada',
              isComplete: true,
              isDeleted: false,
              createdAt: new Date()
            })
          });
        }
      });
      return unsubscribe;
    });

    const { container } = render(<TodoList />);

    const completedTask = container.querySelector('li.completed');
    expect(completedTask).toBeInTheDocument();
  });
});