// Synoptic beamline schematic styled as a scattering experiment:
// beam enters from the left screen edge → 4-bounce mirror set → slit →
// sample (irregular) → scattered rays → detector. Elements navigate to
// site sections. An animated photon runs the beamline (unless the visitor
// prefers reduced motion).

const W = 1200;
const H = 116;
const Y = 52; // beam axis

// 4-bounce zigzag vertices (mirror positions)
const ZIG: [number, number][] = [
  [300, Y],
  [330, Y - 18],
  [360, Y],
  [390, Y - 18],
  [420, Y],
];
const SLIT_X = 590;
const SAMPLE_X = 760;
const DET_X = 1010;

const BEAM_PATH = `M0,${Y} L${ZIG.map(([x, y]) => `${x},${y}`).join(' L')} L${SAMPLE_X},${Y}`;

const SCATTER: { x2: number; y2: number }[] = [
  { x2: DET_X, y2: Y - 34 },
  { x2: DET_X, y2: Y - 14 },
  { x2: DET_X, y2: Y + 16 },
  { x2: DET_X, y2: Y + 36 },
];

interface Element {
  label: string;
  target: string;
  x: number;
  shape: string;
}

function mirrorBar(x: number, y: number, up: boolean): string {
  // small 45°-tilted bar behind each bounce vertex
  const a = up ? -45 : 45;
  return `<rect class="syn-shape syn-mirror" x="${x - 11}" y="${y + (up ? 3 : -7)}" width="22" height="4" transform="rotate(${a} ${x} ${y})"/>`;
}

function elements(): Element[] {
  return [
    {
      label: 'SOURCE · ABOUT',
      target: '#about',
      x: 110,
      // upstream aperture flange the beam emerges through
      shape: `<rect class="syn-shape" x="98" y="${Y - 16}" width="8" height="32"/><rect class="syn-shape" x="112" y="${Y - 12}" width="6" height="24"/>`,
    },
    {
      label: 'M1–M4 · AGENT',
      target: '#console',
      x: 360,
      shape:
        mirrorBar(ZIG[1][0], ZIG[1][1], true) +
        mirrorBar(ZIG[2][0], ZIG[2][1], false) +
        mirrorBar(ZIG[3][0], ZIG[3][1], true) +
        mirrorBar(ZIG[4][0], ZIG[4][1], false),
    },
    {
      label: 'SLIT · PROJECTS',
      target: '#projects',
      x: SLIT_X,
      shape:
        `<rect class="syn-shape" x="${SLIT_X - 3}" y="${Y - 34}" width="6" height="27"/>` +
        `<rect class="syn-shape" x="${SLIT_X - 3}" y="${Y + 7}" width="6" height="27"/>`,
    },
    {
      label: 'SAMPLE · PAPERS',
      target: '#publications',
      x: SAMPLE_X,
      // irregular blob
      shape: `<path class="syn-shape syn-sample" d="M${SAMPLE_X - 11},${Y - 3} C${SAMPLE_X - 13},${Y - 12} ${SAMPLE_X - 3},${Y - 16} ${SAMPLE_X + 4},${Y - 12} C${SAMPLE_X + 13},${Y - 9} ${SAMPLE_X + 12},${Y + 2} ${SAMPLE_X + 7},${Y + 8} C${SAMPLE_X + 2},${Y + 14} ${SAMPLE_X - 8},${Y + 11} ${SAMPLE_X - 11},${Y - 3} Z"/>`,
    },
    {
      label: 'DETECTOR · CONTACT',
      target: '#contact',
      x: DET_X + 10,
      shape: `<rect class="syn-shape syn-det" x="${DET_X}" y="${Y - 44}" width="14" height="88"/>`,
    },
  ];
}

export function renderSynoptic(container: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parts: string[] = [];

  // static beam: entering ray + zigzag + to sample
  parts.push(`<path class="syn-beam-glow" d="${BEAM_PATH}" fill="none"/>`);
  parts.push(`<path class="syn-beam" d="${BEAM_PATH}" fill="none"/>`);

  // weaker scattered rays: sample → detector face
  for (const s of SCATTER) {
    parts.push(`<line class="syn-scatter" x1="${SAMPLE_X}" y1="${Y}" x2="${s.x2}" y2="${s.y2}"/>`);
  }
  // direct beam continues (attenuated) to detector center
  parts.push(`<line class="syn-scatter syn-direct" x1="${SAMPLE_X}" y1="${Y}" x2="${DET_X}" y2="${Y}"/>`);

  // clickable elements
  for (const el of elements()) {
    parts.push(
      `<g class="syn-el" role="link" tabindex="0" data-target="${el.target}" aria-label="${el.label}">` +
        `<rect class="syn-hit" x="${el.x - 45}" y="0" width="90" height="${H}" fill="transparent"/>` +
        el.shape +
        `<text x="${el.x}" y="${H - 8}" text-anchor="middle">${el.label}</text></g>`,
    );
  }

  // animated photon + scattered pulses (SMIL, synced by id chaining)
  if (!reduceMotion) {
    parts.push(
      `<circle class="syn-photon" r="3.2">` +
        `<animateMotion id="synMain" begin="0s;synScat3.end+0.7s" dur="2.2s" path="${BEAM_PATH}" fill="freeze"/>` +
        `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.98;1" begin="synMain.begin" dur="2.2s" fill="freeze"/>` +
        `</circle>`,
    );
    SCATTER.forEach((s, i) => {
      parts.push(
        `<circle class="syn-photon syn-photon-weak" r="2" opacity="0">` +
          `<animateMotion id="synScat${i}" begin="synMain.end" dur="0.55s" path="M${SAMPLE_X},${Y} L${s.x2},${s.y2}" fill="freeze"/>` +
          `<animate attributeName="opacity" values="0.7;0.7;0" keyTimes="0;0.9;1" begin="synMain.end" dur="0.55s" fill="freeze"/>` +
          `</circle>`,
      );
    });
    // sample flash on photon arrival
    parts.push(
      `<circle class="syn-flash" cx="${SAMPLE_X}" cy="${Y}" r="14" opacity="0">` +
        `<animate attributeName="opacity" values="0.5;0" begin="synMain.end" dur="0.5s" fill="freeze"/>` +
        `</circle>`,
    );
  }

  container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;

  container.querySelectorAll<SVGGElement>('.syn-el').forEach((g) => {
    const go = () => {
      document.querySelector(g.dataset.target!)?.scrollIntoView({ behavior: 'smooth' });
    };
    g.addEventListener('click', go);
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });
}
