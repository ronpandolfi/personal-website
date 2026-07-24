// Synoptic beamline schematic: source → optics → endstation → detector,
// each element navigating to a site section.

interface Element {
  id: string;
  label: string;
  target: string;
  shape: 'circle' | 'rect' | 'diamond';
}

const ELEMENTS: Element[] = [
  { id: 'source', label: 'SOURCE / ABOUT', target: '#about', shape: 'circle' },
  { id: 'console', label: 'CONSOLE / AGENT', target: '#console', shape: 'diamond' },
  { id: 'optics', label: 'OPTICS / PROJECTS', target: '#projects', shape: 'rect' },
  { id: 'endstation', label: 'ENDSTATION / PAPERS', target: '#publications', shape: 'rect' },
  { id: 'detector', label: 'DETECTOR / CONTACT', target: '#contact', shape: 'circle' },
];

export function renderSynoptic(container: HTMLElement) {
  const W = 960;
  const H = 84;
  const y = 38;
  const margin = 70;
  const step = (W - 2 * margin) / (ELEMENTS.length - 1);

  const parts: string[] = [];
  parts.push(`<line class="syn-beam-glow" x1="${margin}" y1="${y}" x2="${W - margin}" y2="${y}"/>`);
  parts.push(`<line class="syn-beam" x1="${margin}" y1="${y}" x2="${W - margin}" y2="${y}"/>`);

  ELEMENTS.forEach((el, i) => {
    const x = margin + i * step;
    let shape = '';
    if (el.shape === 'circle') shape = `<circle class="syn-shape" cx="${x}" cy="${y}" r="14"/>`;
    if (el.shape === 'rect') shape = `<rect class="syn-shape" x="${x - 16}" y="${y - 12}" width="32" height="24"/>`;
    if (el.shape === 'diamond')
      shape = `<rect class="syn-shape" x="${x - 12}" y="${y - 12}" width="24" height="24" transform="rotate(45 ${x} ${y})"/>`;
    parts.push(
      `<g class="syn-el" role="link" tabindex="0" data-target="${el.target}" aria-label="${el.label}">` +
        shape +
        `<text x="${x}" y="${y + 34}" text-anchor="middle">${el.label}</text></g>`,
    );
  });

  container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;

  container.querySelectorAll<SVGGElement>('.syn-el').forEach((g) => {
    const go = () => {
      const target = document.querySelector(g.dataset.target!);
      target?.scrollIntoView({ behavior: 'smooth' });
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
