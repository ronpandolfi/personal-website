import './style.css';
import { renderSynoptic } from './synoptic';
import { startSimReadouts, loadBeamPlot, startClock } from './sim';
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
startSimReadouts();
loadBeamPlot();
setupAgentConsole();
