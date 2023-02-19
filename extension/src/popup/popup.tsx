import React from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import Login from './login';

const App: React.FC<{}> = () => {
  return (
    <div>
      <img src="icon.png" />
    </div>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(
  <div className="window">
    <React.StrictMode>
      <Login />
    </React.StrictMode>
  </div>
);
