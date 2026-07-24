export function startClock() {
  const el = document.getElementById('clock')!;
  const tick = () => {
    el.textContent = new Date().toLocaleString('en-US', {
      hour12: false,
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };
  tick();
  setInterval(tick, 1000);
}
