import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import Login from './login';
import Main from './Main';

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
const auth = localStorage.getItem("authenticated");

function App () {

  return (
    <div className="window">
        <React.StrictMode>
          {auth=="true" ?
            <Main />
            : <Login />
          }
        </React.StrictMode>
      </div>
  );
}

root.render(<App />);
