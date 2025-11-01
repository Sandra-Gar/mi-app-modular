import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore"; 
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  // --- CARGAR DATOS EN TIEMPO REAL ---
  useEffect(() => {
    const collectionRef = collection(db, "tasks");
    const q = query(collectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newTasks = [];
      querySnapshot.forEach((doc) => {
        newTasks.push({ ...doc.data(), id: doc.id });
      });
      setTasks(newTasks);
    });

    return () => unsubscribe();
  }, []);

  // --- AÑADIR NUEVA TAREA ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    await addDoc(collection(db, "tasks"), {
      text: inputValue,
      isComplete: false,
      isDeleted: false,
      createdAt: serverTimestamp()
    });

    setInputValue('');
  };

  // --- MARCAR / DESMARCAR COMPLETA ---
  const toggleTask = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      isComplete: !task.isComplete
    });
  };

  // --- ELIMINAR (marcar como eliminada) ---
  const deleteTask = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    await updateDoc(taskRef, {
      isDeleted: true
    });
  };

  // --- FILTROS ---
  const visibleTasks = tasks.filter(task => !task.isDeleted);
  const completedTasks = tasks.filter(task => task.isComplete && !task.isDeleted);
  const deletedTasks = tasks.filter(task => task.isDeleted);

  return (
    <div className="todo-list-container">
      <h2>Mi Lista de Tareas</h2>

      <form onSubmit={handleAddTask} className="add-task-form">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Añade una nueva tarea..."
        />
        <button type="submit">Añadir</button>
      </form>

      <button 
        className="history-toggle-btn"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'Volver a tareas' : 'Ver historial'}
      </button>

      {!showHistory ? (
        <>
          <h3>Tareas (activas y completadas)</h3>
          <ul>
            {visibleTasks.length > 0 ? (
              visibleTasks.map(task => (
                <li key={task.id} className={task.isComplete ? 'completed' : ''}>
                  <span 
                    className="task-text"
                    onClick={() => toggleTask(task)}
                  >
                    {task.text}
                  </span>
                  <div className="task-buttons">
                    <button 
                      className={`complete-btn ${task.isComplete ? 'completed' : ''}`}
                      onClick={() => toggleTask(task)}
                    >
                      {task.isComplete ? '✓' : ''}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteTask(task)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No hay tareas registradas.</p>
            )}
          </ul>
        </>
      ) : (
        <div className="history-section">
          <h3>Historial</h3>

          <h4>Tareas completadas ✅</h4>
          <ul>
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <li key={task.id} className="completed">
                  {task.text}
                </li>
              ))
            ) : (
              <p>No hay tareas completadas.</p>
            )}
          </ul>

          <h4>Tareas eliminadas 🗑</h4>
          <ul>
            {deletedTasks.length > 0 ? (
              deletedTasks.map(task => (
                <li key={task.id} className="deleted">
                  {task.text}
                </li>
              ))
            ) : (
              <p>No hay tareas eliminadas.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoList;
