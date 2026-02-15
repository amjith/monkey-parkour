# Monkey Parkour

A 2D browser platformer built with Phaser 3 + TypeScript.

## What is implemented
- 3 playable levels with progression (`level-1` -> `level-2` -> `level-3`).
- Monkey movement with coyote-time jump + jump buffering.
- Hazard set:
  - Falling sky objects
  - Rolling boulders
  - Spikey snails
  - Fire-breathing plants (projectile attacks)
  - Springs that launch the player backward/upward
- 3-heart health model with invulnerability window and checkpoint respawns.
- Golden banana goal with scripted yellow-spud theft cutscene in Levels 1 and 2.
- Final Level auto-scroll chase with boss pressure.
- Golden confetti victory sequence and win screen.
- Pause (`P`) and restart-level (`R`) controls.

## Quick Start
Prereqs:
- Node.js 22+
- npm 10+

Install and run:
```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build
```bash
npm run build
npm run preview
```

## Controls
- Move: `Left/Right` or `A/D`
- Jump: `Space` or `W`
- Pause: `P`
- Restart level: `R`

## Project Structure
- `src/scenes`: Boot/Menu/Level/Win scenes.
- `src/entities`: player controller and boss entity.
- `src/systems`: runtime texture generation.
- `src/ui`: HUD display and in-level messages.
- `src/data`: level definitions and progression.
- `src/types`: public game contracts (`LevelDefinition`, `HazardDefinition`, etc).
- `src/assets/ATTRIBUTION.md`: asset attribution and replacement plan.

## Content Pipeline Notes
- This build uses runtime-generated placeholder textures so there are no missing file dependencies.
- To swap to external free assets:
  1. Add files under `src/assets/`.
  2. Preload them in `BootScene`.
  3. Replace texture keys in scene/entity code.
  4. Update `src/assets/ATTRIBUTION.md` with exact licenses and links.

