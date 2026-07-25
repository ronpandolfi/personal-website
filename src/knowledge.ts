// Chunked knowledge base for the operator console agent.
// Per query, only the most relevant chunks are injected so the small model
// works from focused, accurate notes instead of one long blob.

export interface Chunk {
  id: string;
  keywords: string[];
  text: string;
}

export const CORE_RULES = `You are the operator console agent on Ronald J. Pandolfi's personal website,
running entirely in the visitor's browser.

STRICT RULES:
- Answer ONLY from the REFERENCE NOTES below. They are the complete set of facts you know.
- If the notes do not cover the question, reply: "I don't have that in my notes. Email Ron at ronpandolfi@lbl.gov."
- Never invent names, dates, versions, URLs, publications, or project details.
- Do not guess. Partial answers from the notes are fine; fabricated completeness is not.
- Keep answers to a few plain, technical sentences.`;

export const CHUNKS: Chunk[] = [
  {
    id: 'bio',
    keywords: ['ron', 'ronald', 'pandolfi', 'who', 'about', 'bio', 'role', 'job', 'work', 'lbnl', 'berkeley', 'als', 'camera', 'amcr', 'contact', 'email', 'hire', 'award', 'halbach', 'r&d'],
    text: `Ronald J. Pandolfi is a Computer Systems Engineer at Lawrence Berkeley National
Laboratory in CAMERA (Center for Advanced Mathematics for Energy Research Applications),
part of the Applied Mathematics and Computational Research Division. He builds control
systems and scientific software for synchrotron beamlines at the Advanced Light Source
(ALS): control UIs, autonomous experiment orchestration, and infrastructure for
reproducible instrument software. He works with the ALS Beamline Controls Group (BCG) on
the facility-wide move to EPICS. He is co-PI of the ASCRIBE project. Awards: Halbach Award
for Innovative Instrumentation (COSMIC-Scattering beamline) and an R&D 100 Award as part
of the gpCAM team. He mentors student interns (including DOE SULI students).
Contact: ronpandolfi@lbl.gov. GitHub: github.com/ronpandolfi.
ORCID: 0000-0003-0824-8548.`,
  },
  {
    id: 'lightfall',
    keywords: ['lightfall', 'dashboard', 'control', 'platform', 'ui', 'frontend', 'cosmic', 'commissioning', 'plugin', 'nats', 'tiled', 'keycloak', 'install', 'deploy'],
    text: `Lightfall is a modern, unified control platform for synchrotron lightsource
facilities, developed by Ron as principal developer. It is API-first, plugin-based, and can
be driven by operators and AI agents. It integrates EPICS, Bluesky, Tiled data services,
Keycloak authentication, and NATS messaging. It is in commissioning at the ALS
COSMIC-Scattering beamline. Source: github.com/als-controls/lightfall. Docs:
als-controls.github.io/lightfall. Described in Pandolfi et al., arXiv:2606.06711.
Installing: Lightfall is deployed at ALS beamlines through internal infrastructure; for
deployment elsewhere or collaboration, email Ron.`,
  },
  {
    id: 'controls-infra',
    keywords: ['csm', 'iocular', 'epics', 'ioc', 'bcg', 'beamline controls', 'configuration', 'ansible', 'awx', 'provisioning', 'telemetry', 'modernization', 'transition', 'labview', 'bcs'],
    text: `For the ALS controls modernization (the facility-wide move to EPICS), Ron built:
CSM, a configuration-management API where declarative device configs provision EPICS IOCs
across the facility via Ansible/AWX (internal); and IOCular, an IOC management agent for
fleet-wide monitoring, remote control, log streaming, and deployment (internal). The
existing beamline control system (BCS) is LabVIEW-based; the transition is designed to be
reversible. bcsophyd-zmq (also called BCS-Ophyd-ZMQ) bridges LabVIEW BCS to the Bluesky
framework over ZeroMQ, providing Ophyd-compatible devices.
Source: github.com/als-controls/BCS-Ophyd-ZMQ, docs: bcsophyd-zmq.readthedocs.io.`,
  },
  {
    id: 'gpcam-start',
    keywords: ['gpcam', 'gaussian', 'autonomous', 'adaptive', 'start', 'install', 'tutorial', 'optimize', 'gpoptimizer', 'ask', 'tell', 'acquisition', 'kernel', 'experiment', 'sampling', 'raster', 'bayesian'],
    text: `gpCAM (current version 8.3.x) is CAMERA's autonomous-experimentation and
uncertainty-quantification engine, led by Marcus Noack; Ron contributes and builds
applications on it. Getting started: pip install gpcam. The main class is GPOptimizer from
the gpcam package. Simplest path: gpo = GPOptimizer(); gpo.optimize(func=f,
search_space=bounds_array, max_iter=N) where f takes points of shape (N, D) and returns
(values, noise_variances). For live instruments, use the ask/tell loop: take 5-10x the
input dimensionality of random initial points, train the GP, then repeatedly ask for the
next best point, measure, tell the result, and retrain periodically. Key choices: kernel
(default Matern-3/2 is good for most cases), acquisition function ('variance' for
exploration/mapping, 'expected improvement' or 'ucb' for optimization), and noise model.
Validate fits with gpo.rmse() and gpo.crps(). Docs: gpcam.lbl.gov.`,
  },
  {
    id: 'gpcam-advanced',
    keywords: ['gp2scale', 'fvgp', 'hgdl', 'multi-task', 'kernel', 'cost', 'noise', 'prior', 'mean', 'scale', 'hpc', 'dask', 'million', 'sparse'],
    text: `Advanced gpCAM: custom kernels, prior-mean, noise, and cost functions encode
domain knowledge (periodicity, smoothness, physics baselines, motor-travel costs). fvGP is
the flexible Gaussian-process engine under gpCAM; HGDL provides distributed function
optimization. gp2Scale uses compactly-supported non-stationary kernels plus Dask
distributed computing for exact GPs on very large datasets (up to ~10 million points); see
Noack, Risser, Luo, Tekriwal, Pandolfi, arXiv:2512.06143. Multi-task/vector-valued
experiments use the fvGP optimizer with an x_out argument.`,
  },
  {
    id: 'tsuchinoko',
    keywords: ['tsuchinoko', 'qt', 'gui', 'desktop', 'adaptive', 'autonomous', 'application'],
    text: `Tsuchinoko is Ron's desktop Qt application that runs gpCAM adaptive experiments at
the beamline: it measures where the information is instead of raster scanning, with live
visualization of the GP posterior and acquisition surface. Source:
github.com/lbl-camera/tsuchinoko, docs: tsuchinoko.readthedocs.io. Ron gave an invited
seminar on Tsuchinoko at NSLS-II (Brookhaven National Laboratory).`,
  },
  {
    id: 'xicam',
    keywords: ['xi-cam', 'xicam', 'xi cam', 'data', 'reduction', 'analysis', 'visualization', 'saxs', 'acquisition'],
    text: `Xi-CAM is an extensible plugin-based platform for synchrotron data reduction,
visualization, and management; Ron is the lead author of the Xi-cam paper (Journal of
Synchrotron Radiation, 2018, cited 100+). Source: github.com/Xi-CAM/Xi-cam, docs:
xi-cam.readthedocs.io. At the ALS it has also served as an acquisition frontend; it is
being succeeded by Lightfall for controls.`,
  },
  {
    id: 'ascribe',
    keywords: ['ascribe', 'xr', 'vr', 'virtual', 'reality', 'godot', 'openxr', 'visualization', 'headset', 'mesh', 'volume', 'point cloud'],
    text: `ASCRIBE is an extended-reality scientific visualization project; Ron is co-PI.
ASCRIBE-XR brings scientific imagery (meshes, volumes, point clouds) into virtual reality,
built on Godot 4 and OpenXR. The ASCRIBE-Link service streams specimens to headsets over
HTTP, live from running experiments. Source: github.com/lbl-camera/Ascribe-XR. Papers:
"ASCRIBE-XR: Extended Reality for Visualization of Scientific Images," Proc. SC'25
Workshops, DOI 10.1145/3731599.3767368 (presented at SC'25), and arXiv:2507.03170.`,
  },
  {
    id: 'publications',
    keywords: ['paper', 'publication', 'publish', 'cite', 'citation', 'arxiv', 'doi', 'talk', 'seminar', 'scholar', 'journal'],
    text: `Selected publications: (1) "Lightfall: An API-first, LLM-addressable control
platform for synchrotron beamlines," Pandolfi, Guenzing, Noack, Morley, English, 2026,
arXiv:2606.06711. (2) "ASCRIBE-XR: Extended Reality for Visualization of Scientific
Images," Pandolfi, Todd, Donatelli, Ushizima, Proc. SC'25 Workshops, DOI
10.1145/3731599.3767368. (3) "gp2Scale" (exact GPs on 10 million points), Noack, Risser,
Luo, Tekriwal, Pandolfi, arXiv:2512.06143. (4) "Xi-cam: a versatile interface for data
visualization and analysis," Journal of Synchrotron Radiation, 2018, cited 100+.
Invited talk: "Tsuchinoko: a GUI for Autonomous Experiments," seminar at NSLS-II.
Full list: Google Scholar (user HilPbaoAAAAJ).`,
  },
  {
    id: 'this-site',
    keywords: ['website', 'site', 'page', 'agent', 'console', 'model', 'webgpu', 'webllm', 'browser', 'llm', 'you', 'yourself', 'privacy', 'synoptic', 'animation'],
    text: `This website is styled like a beamline control dashboard. The navigation is a
synoptic schematic of a scattering beamline (undulator, four-bounce mirror periscope, slit,
sample, detector) with an animated photon. This agent (you) is a small open-weights
language model running fully client-side via WebLLM on WebGPU; nothing the visitor types
leaves their machine, and there are no trackers. The ring-current readout in the status bar
is a labeled simulation. Site source: github.com/ronpandolfi/personal-website.`,
  },
];

/** Score chunks against the query and return the top few as a notes block. */
export function selectNotes(query: string, maxChunks = 3): string {
  const q = query.toLowerCase();
  const scored = CHUNKS.map((c) => ({
    c,
    score: c.keywords.reduce((s, k) => s + (q.includes(k) ? (k.length > 4 ? 2 : 1) : 0), 0),
  }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((s) => s.c);

  // bio is the safe default context; always present
  if (!scored.some((c) => c.id === 'bio')) scored.unshift(CHUNKS[0]);

  return scored.map((c) => `### ${c.id}\n${c.text}`).join('\n\n');
}

export function buildSystemPrompt(query: string): string {
  return `${CORE_RULES}\n\nREFERENCE NOTES:\n\n${selectNotes(query)}`;
}
