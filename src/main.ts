import './style.css';
import { renderSynoptic } from './synoptic';
import { startClock } from './sim';
import { startBeamStatus } from './beamstatus';
import { setupAgentConsole } from './agent';

// Theme toggle
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
document.getElementById('theme-toggle')!.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
});

renderSynoptic(document.getElementById('synoptic')!);
startClock();
startBeamStatus();
setupAgentConsole();

// console dock collapse/expand
const dock = document.getElementById('console')!;
const dockToggle = document.getElementById('console-toggle')!;
dockToggle.addEventListener('click', () => {
  const collapsed = dock.classList.toggle('collapsed');
  dockToggle.setAttribute('aria-expanded', String(!collapsed));
});
