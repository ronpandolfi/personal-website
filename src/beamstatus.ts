// Status-bar ALS ring readout.
// There is no public CORS-friendly ALS machine-status endpoint today, so this
// runs a labeled SIM by default. When the site is hosted, point BEAM_ENDPOINT at
// a small proxy (Cloudflare Worker / scheduled job) returning
//   { "current_mA": number, "status": string }
// and the readout goes live automatically.

const BEAM_ENDPOINT: string | null = null;

export function startBeamStatus() {
  const value = document.getElementById('beam-value')!;
  const tag = document.getElementById('beam-tag')!;

  const simulate = () => {
    let t = Math.floor(Math.random() * 30);
    const tick = () => {
      t += 1;
      const sawtooth = 500 - 1.2 * ((t % 30) / 30);
      const noise = (Math.random() - 0.5) * 0.08;
      value.textContent = `${(sawtooth + noise).toFixed(1)} mA`;
    };
    tick();
    setInterval(tick, 2000);
  };

  if (!BEAM_ENDPOINT) {
    simulate();
    return;
  }

  const poll = async () => {
    try {
      const res = await fetch(BEAM_ENDPOINT);
      const data = await res.json();
      value.textContent = `${Number(data.current_mA).toFixed(1)} mA`;
      tag.textContent = 'LIVE';
      tag.classList.remove('tag-sim');
      tag.classList.add('tag-live');
    } catch {
      tag.textContent = 'STALE';
      tag.classList.remove('tag-live');
    }
  };
  poll();
  setInterval(poll, 60_000);
}
