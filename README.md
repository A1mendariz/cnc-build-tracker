# CNC Build Tracker

A local web app for tracking design decisions and bill of materials for a 900×600×150mm moving-gantry CNC router build.

## The machine

- **Work envelope:** 900 × 600 × 150 mm (X × Y × Z)
- **Type:** Moving gantry router
- **Materials:** Wood and aluminum
- **Frame:** 40×120 aluminum extrusion base + machined plate gantry
- **Drive:** 1605 ballscrews, closed-loop steppers (~2Nm)
- **Spindle:** 2.2kW water-cooled + VFD, ER20 collet
- **Control:** LinuxCNC + Mesa 7i96S FPGA over Ethernet

## The tracker

A two-tab web UI — **Decision Log** and **Bill of Materials** — backed by a single JSON file. Every edit in the browser writes back to `cnc-data.json` immediately.

```
cnc-data.json        ← single source of truth
server.js            ← local Node.js server (no dependencies)
cnc-decisions.html   ← web UI
```

### Features

**Decision Log**
- Filter by subsystem (Frame, Motion, Drive, Spindle, Control, Joint)
- Full-text search
- Status tracking: Firm / Tradeoff / Open
- Add new decisions inline

**Bill of Materials**
- Filter and search by category
- Per-item: name, supplier, product URL, qty, unit, unit price, status, notes
- Running cost estimate
- Inline edit and delete on every card
- Status tracking: Pending / Ordered / Received

## Getting started

Requires [Node.js](https://nodejs.org).

```bash
git clone https://github.com/A1mendariz/cnc-build-tracker.git
cd cnc-build-tracker
node server.js
```

Then open **http://localhost:3000** in your browser.

## Data

All decisions and BOM items live in `cnc-data.json`. The server exposes two endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET`  | `/data` | Read the JSON file |
| `POST` | `/data` | Write the JSON file |

The HTML fetches on load and posts on every change — no manual save needed.
