# Personal Website — Prototype Design

**Date:** 2026-07-24 · **Status:** shallow prototype pass (approved direction, depth TBD after review)

## Purpose

Professional presence for Ron Pandolfi (ALS beamline controls, LBNL). Inspired by
marcusnoack.com's "clean scientist portfolio + one signature interactive element,"
but distinctly control-systems flavored — not a clone, less content.

## Concept

The site reads like one of Ron's own control dashboards (Lightfall design language),
with three concept layers prototyped shallowly to evaluate:

- **A. Site-as-dashboard** — panel/dock layout, engineering typography, status-bar
  footer, light/dark theme toggle.
- **B. Real ALS data** — the hero embeds the real daily beam-current plot GIF from
  `https://controls.als.lbl.gov/beamdata/` (public, no CORS issue for `<img>`).
  Numeric readouts are simulated and labeled `SIM`. True live numbers would require
  a small proxy (Cloudflare Worker or scheduled job) — deferred.
- **C. Synoptic nav** — inline-SVG beamline schematic (source → optics → endstation)
  whose elements scroll to site sections.
- **Agent console** — the signature interactive element. Opt-in "boot" panel running
  a small instruct model fully client-side via WebLLM/WebGPU. Grounded persona:
  answers questions about Ron's projects (getting started with gpCAM, installing
  Lightfall, etc.) from a system prompt distilled from existing skill docs.
  IOC-style boot log while loading; disclaimer (small local model, may err);
  graceful message when WebGPU is unavailable. Model download is opt-in only.

## Content sections

About/bio · Projects/software (Lightfall, Tsuchinoko, Xi-CAM, gpCAM ecosystem,
CSM/BCS — **not** Finch) · Publications & talks (selected) · Contact/links footer
(GitHub, GitLab, ORCID, LinkedIn, email). Placeholder-accurate copy for prototype;
Ron reviews/replaces later.

## Tech

Vite + vanilla TypeScript, no framework. `@mlc-ai/web-llm` (Qwen2.5-1.5B-Instruct
q4 as first model). Static hosting target (GitHub Pages or similar) — decided later.

## Out of scope (this pass)

Real CV data completeness, live-numeric proxy, screencap media for projects,
Vibe-mode easter egg, hosting/deploy, SEO/analytics.

## Success criteria

Prototype runs locally via `npm run dev`; Ron can eyeball A/B/C + agent and pick
what survives to the real build.
