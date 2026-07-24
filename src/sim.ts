// Simulated readouts (labeled SIM in the UI) + the real daily beam plot image.

export function startSimReadouts() {
  const current = document.getElementById('ro-current')!;
  const lifetime = document.getElementById('ro-lifetime')!;

  // Top-off sawtooth around 500 mA with small noise.
  let t = 0;
  const tick = () => {
    t += 1;
    const sawtooth = 500 - 1.2 * (t % 30) / 30;
    const noise = (Math.random() - 0.5) * 0.08;
    current.textContent = `${(sawtooth + noise).toFixed(2)} mA`;
    lifetime.textContent = `${(6.5 + Math.sin(t / 40) * 0.5 + (Math.random() - 0.5) * 0.05).toFixed(1)} h`;
  };
  tick();
  setInterval(tick, 1000);
}

export function loadBeamPlot() {
  const img = document.getElementById('beamplot') as HTMLImageElement;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const stamp = `${months[now.getMonth()]}_${now.getDate()},${now.getFullYear()}`;
  img.src = `https://controls.als.lbl.gov/beamdata/als_ops/beamdata/status.${stamp}.gif`;
  img.addEventListener('error', () => {
    // Archive image missing (date format edge case or outage): hide gracefully.
    img.style.display = 'none';
    const tag = document.querySelector('.hero-beam .tag-live');
    if (tag) {
      tag.textContent = 'NO DATA';
      tag.classList.remove('tag-live');
      tag.classList.add('tag-err');
    }
  });
}

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
