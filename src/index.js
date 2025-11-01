import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter } from 'react-router-dom'; // <-- Importar

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Envolver la App */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { ThemeProvider } from './context/ThemeContext'; // <-- Importamos

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <ThemeProvider> {/* <-- Envolvemos nuestra App */}
//       <App />
//     </ThemeProvider>
//   </React.StrictMode>
// );
