// Synoptic beamline schematic styled as a scattering experiment:
// electron beam enters from the left edge → undulator (wiggle "generates" the
// x-rays) → 4-bounce mirror periscope (up, across, down, right) → slit →
// irregular sample → scattered rays → area detector. Elements navigate to site
// sections. An animated photon runs the beamline (unless the visitor prefers
// reduced motion). No labels — the symbolism speaks for itself.

const W = 1200;
const H = 72;
const Y = 30; // beam axis
const YU = 14; // periscope upper level

// element centers spaced evenly across the strip:
// undulator 180 · periscope 425 · slit 650 · sample 865 · detector 1080

// undulator span + wiggle
const UND = { x0: 140, x1: 220 };
const WIGGLE: [number, number][] = [
  [143, Y],
  [153, Y - 4], [165, Y + 4], [177, Y - 4], [189, Y + 4], [201, Y - 4],
  [215, Y],
];

// periscope corners: up, across, down, right (compact)
const M1: [number, number] = [407, Y];
const M2: [number, number] = [407, YU];
const M3: [number, number] = [443, YU];
const M4: [number, number] = [443, Y];

const SLIT_X = 650;
const SAMPLE_X = 865;
const DET_X = 1075;

const BEAM_PATH =
  `M0,${Y} L${WIGGLE.map(([x, y]) => `${x},${y}`).join(' L')} ` +
  `L${M1.join(',')} L${M2.join(',')} L${M3.join(',')} L${M4.join(',')} L${SAMPLE_X},${Y}`;

// the photon is born in the undulator; its animation starts there
const ANIM_PATH =
  `M${WIGGLE.map(([x, y]) => `${x},${y}`).join(' L')} ` +
  `L${M1.join(',')} L${M2.join(',')} L${M3.join(',')} L${M4.join(',')} L${SAMPLE_X},${Y}`;

const SCATTER: { x2: number; y2: number }[] = [
  { x2: DET_X, y2: 11 },
  { x2: DET_X, y2: 21 },
  { x2: DET_X, y2: 39 },
  { x2: DET_X, y2: 49 },
];

// parallel periscope mirrors: "/" pair turns right→up→right, "\" pair down→right
function mirror(x: number, y: number, angle: number): string {
  return `<rect class="syn-shape syn-mirror" x="${x - 9}" y="${y - 1.5}" width="18" height="3" transform="rotate(${angle} ${x} ${y})"/>`;
}

function undulatorMagnets(): string {
  const parts: string[] = [];
  for (let x = UND.x0; x < UND.x1; x += 16) {
    parts.push(`<rect class="syn-shape syn-magnet" x="${x}" y="${Y - 11}" width="11" height="5"/>`);
    parts.push(`<rect class="syn-shape syn-magnet" x="${x + 8}" y="${Y + 6}" width="11" height="5"/>`);
  }
  return parts.join('');
}

interface Element {
  label: string;
  target: string;
  cx: number;
  halfWidth: number;
  shape: string;
}

function elements(): Element[] {
  return [
    {
      label: 'ABOUT',
      target: '#about',
      cx: (UND.x0 + UND.x1) / 2,
      halfWidth: 55,
      shape: undulatorMagnets(),
    },
    {
      label: 'ROLE',
      target: '#role',
      cx: 425,
      halfWidth: 40,
      shape:
        mirror(M1[0], M1[1], -45) +
        mirror(M2[0], M2[1], -45) +
        mirror(M3[0], M3[1], 45) +
        mirror(M4[0], M4[1], 45),
    },
    {
      label: 'PROJECTS',
      target: '#projects',
      cx: SLIT_X,
      halfWidth: 30,
      shape:
        `<rect class="syn-shape" x="${SLIT_X - 2.5}" y="${Y - 19}" width="5" height="15"/>` +
        `<rect class="syn-shape" x="${SLIT_X - 2.5}" y="${Y + 4}" width="5" height="15"/>`,
    },
    {
      label: 'PUBLICATIONS',
      target: '#publications',
      cx: SAMPLE_X,
      halfWidth: 30,
      // jagged, asymmetric lump
      shape:
        `<path class="syn-shape syn-sample" d="M${SAMPLE_X - 9},${Y + 1} ` +
        `L${SAMPLE_X - 7},${Y - 5} L${SAMPLE_X - 2},${Y - 4} L${SAMPLE_X},${Y - 9} ` +
        `L${SAMPLE_X + 4},${Y - 5} L${SAMPLE_X + 9},${Y - 6} L${SAMPLE_X + 8},${Y} ` +
        `L${SAMPLE_X + 10},${Y + 4} L${SAMPLE_X + 3},${Y + 6} L${SAMPLE_X},${Y + 9} ` +
        `L${SAMPLE_X - 5},${Y + 5} Z"/>`,
    },
    {
      label: 'CONTACT',
      target: '#contact',
      cx: DET_X + 5,
      halfWidth: 35,
      shape: `<rect class="syn-shape syn-det" x="${DET_X}" y="8" width="10" height="42"/>`,
    },
  ];
}

export function renderSynoptic(container: HTMLElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parts: string[] = [];

  parts.push(`<path class="syn-beam-glow" d="${BEAM_PATH}" fill="none"/>`);
  parts.push(`<path class="syn-beam" d="${BEAM_PATH}" fill="none"/>`);

  // upstream feed: thicker, breathing with a little instability and a lot of power
  const feedAnim = reduceMotion
    ? ''
    : `<animate attributeName="opacity" values="0.18;0.42;0.24;0.5;0.3;0.44;0.18" dur="3.1s" repeatCount="indefinite"/>`;
  parts.push(
    `<line class="syn-feed-glow" x1="0" y1="${Y}" x2="${WIGGLE[0][0]}" y2="${Y}" stroke-width="10" opacity="0.3">${feedAnim}</line>`,
  );
  parts.push(
    `<line class="syn-feed" x1="0" y1="${Y}" x2="${WIGGLE[0][0]}" y2="${Y}" stroke-width="3">${
      reduceMotion
        ? ''
        : `<animate attributeName="stroke-width" values="3;3.6;3.1;3.8;3.3;3" dur="3.1s" repeatCount="indefinite"/>`
    }</line>`,
  );

  for (const s of SCATTER) {
    parts.push(`<line class="syn-scatter" x1="${SAMPLE_X}" y1="${Y}" x2="${s.x2}" y2="${s.y2}"/>`);
  }
  parts.push(`<line class="syn-scatter syn-direct" x1="${SAMPLE_X}" y1="${Y}" x2="${DET_X}" y2="${Y}"/>`);

  for (const el of elements()) {
    parts.push(
      `<g class="syn-el" role="link" tabindex="0" data-target="${el.target}" aria-label="${el.label}">` +
        `<rect class="syn-hit" x="${el.cx - el.halfWidth}" y="0" width="${el.halfWidth * 2}" height="${H}" fill="transparent"/>` +
        el.shape +
        `<text x="${el.cx}" y="${H - 6}" text-anchor="middle">${el.label}</text>` +
        `</g>`,
    );
  }

  if (!reduceMotion) {
    parts.push(
      `<circle class="syn-photon" r="2.5">` +
        `<animateMotion id="synMain" begin="0s;synScat3.end+0.7s" dur="2s" path="${ANIM_PATH}" fill="freeze"/>` +
        `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.98;1" begin="synMain.begin" dur="2s" fill="freeze"/>` +
        `</circle>`,
    );
    SCATTER.forEach((s, i) => {
      parts.push(
        `<circle class="syn-photon syn-photon-weak" r="1.6" opacity="0">` +
          `<animateMotion id="synScat${i}" begin="synMain.end" dur="0.55s" path="M${SAMPLE_X},${Y} L${s.x2},${s.y2}" fill="freeze"/>` +
          `<animate attributeName="opacity" values="0.7;0.7;0" keyTimes="0;0.9;1" begin="synMain.end" dur="0.55s" fill="freeze"/>` +
          `</circle>`,
      );
    });
    parts.push(
      `<circle class="syn-flash" cx="${SAMPLE_X}" cy="${Y}" r="11" opacity="0">` +
        `<animate attributeName="opacity" values="0.5;0" begin="synMain.end" dur="0.5s" fill="freeze"/>` +
        `</circle>`,
    );
  }

  // tail: continues the feed line from the left screen edge to the schematic.
  // Same stroke widths/animations as the in-svg feed, pre-scaled by the
  // schematic's render scale (1250px / 1200 units) so they match on screen.
  const S = 1250 / W;
  const tailCoreAnim = reduceMotion
    ? ''
    : `<animate attributeName="stroke-width" values="${[3, 3.6, 3.1, 3.8, 3.3, 3]
        .map((v) => (v * S).toFixed(2))
        .join(';')}" dur="3.1s" repeatCount="indefinite"/>`;
  const tailGlowAnim = reduceMotion
    ? ''
    : `<animate attributeName="opacity" values="0.18;0.42;0.24;0.5;0.3;0.44;0.18" dur="3.1s" repeatCount="indefinite"/>`;
  const tail =
    `<div class="synoptic-tail" aria-hidden="true">` +
    `<svg viewBox="0 0 100 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
    `<line class="syn-feed-glow" x1="0" y1="20" x2="100" y2="20" stroke-width="${(10 * S).toFixed(2)}" opacity="0.3" vector-effect="non-scaling-stroke">${tailGlowAnim}</line>` +
    `<line class="syn-feed" x1="0" y1="20" x2="100" y2="20" stroke-width="${(3 * S).toFixed(2)}" vector-effect="non-scaling-stroke">${tailCoreAnim}</line>` +
    `</svg></div>`;

  container.innerHTML =
    tail +
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;

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
