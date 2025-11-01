import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import ThemeContext from './context/ThemeContext';

// Importar el Layout y las Páginas
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import TodoList from './components/TodoList/TodoList';
import UserDirectory from './components/UserDirectory/UserDirectory';
import Error404 from './components/Error404/Error404';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App ${theme}`}>
      {/* El componente <Routes> envuelve todas las rutas */}
      <Routes>
        {/* Esta es una "Ruta de Layout".
          Todas las rutas anidadas dentro se renderizarán DENTRO del <Outlet /> de Layout.
        */}
        <Route path="/" element={<Layout />}>

          {/* Rutas Hijas */}
          <Route index element={<Home />} />
          <Route path="tareas" element={<TodoList />} />
          <Route path="directorio" element={<UserDirectory />} />

          {/* Ruta "Catch-all" para 404 (No encontrado) */}
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

// import React, { useContext } from 'react';
// import './App.css';
// import Header from './components/Header/Header';
// import UserDirectory from './components/UserDirectory/UserDirectory';
// import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher'; // Importamos el interruptor
// import ThemeContext from './context/ThemeContext'; // Importamos el contexto

// function App() {
//   const { theme } = useContext(ThemeContext); // Consumimos el contexto

//   // Añadimos una clase 'dark' al div principal si el tema es oscuro
//   return (
//     <div className={`App ${theme}`}>
//       <Header />
//       <ThemeSwitcher /> {/* Añadimos el interruptor */}
//       <main>
//         <UserDirectory />
//       </main>
//     </div>
//   );
// }

// export default App;