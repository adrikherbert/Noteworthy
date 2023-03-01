import React from 'react';
import { createRoot } from 'react-dom/client';
import Note from './note'
import HtmlNote from './htmlNote';

console.log('Chrome Extension Running');
const body = document.querySelector('body')
const app = document.createElement('div')

app.id = 'react-root'

if (body) {
  body.prepend(app)
}

const container = document.getElementById('react-root');
const root = createRoot(container);

root.render(<><Note /><HtmlNote /></>);