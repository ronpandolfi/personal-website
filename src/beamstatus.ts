// Status-bar ALS ring readout.
// Real data: a scheduled GitHub Action (.github/workflows/beam-status.yml)
// polls the ALS controls status feed every 5 minutes (no CORS on the origin
// feed, so the Action republishes it) and force-pushes beam.json to the
// `data` branch, which raw.githubusercontent.com serves with open CORS.

const BEAM_ENDPOINT =
  'https://raw.githubusercontent.com/ronpandolfi/personal-website/refs/heads/data/beam.json';

// If the feed goes quiet for this long, stop calling it live.
const STALE_AFTER_S = 30 * 60;

interface BeamData {
  current_mA: number;
  lifetime_h: number;
  energy_gev: number;
  comment: string;
  source_tstamp: number;
  fetched: number;
}

export function startBeamStatus() {
  const value = document.getElementById('beam-value')!;
  const tag = document.getElementById('beam-tag')!;
  const item = value.closest('.statusbar-item') as HTMLElement | null;

  let simTimer: number | undefined;

  const simulate = () => {
    if (simTimer !== undefined) return;
    tag.textContent = 'SIM';
    tag.classList.add('tag-sim');
    tag.classList.remove('tag-live');
    let t = Math.floor(Math.random() * 30);
    const tick = () => {
      t += 1;
      const sawtooth = 500 - 1.2 * ((t % 30) / 30);
      value.textContent = `${(sawtooth + (Math.random() - 0.5) * 0.08).toFixed(1)} mA`;
    };
    tick();
    simTimer = window.setInterval(tick, 2000);
  };

  const poll = async () => {
    try {
      const res = await fetch(`${BEAM_ENDPOINT}?t=${Math.floor(Date.now() / 60000)}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: BeamData = await res.json();
      if (simTimer !== undefined) {
        clearInterval(simTimer);
        simTimer = undefined;
      }
      value.textContent = `${data.current_mA.toFixed(1)} mA`;
      const fresh = Date.now() / 1000 - data.fetched < STALE_AFTER_S;
      tag.textContent = fresh ? 'LIVE' : 'STALE';
      tag.classList.toggle('tag-live', fresh);
      tag.classList.remove('tag-sim');
      if (item && data.comment) item.title = data.comment;
    } catch {
      // feed unavailable: honest simulation rather than a dead readout
      simulate();
    }
  };

  poll();
  setInterval(poll, 5 * 60 * 1000);
}
