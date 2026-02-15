import './style.css';
import { createGame } from './game';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app container');
}

app.innerHTML = '<div id="game-container"></div>';

createGame('game-container');
