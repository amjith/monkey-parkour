# Monkey Parkour Implementation Plan

## Summary
Build a browser-based 2D platformer where a monkey chases a golden banana stolen by a yellow spud boss.

Current implementation status: vertical slice implemented with 3 levels, scripted theft events in Levels 1 and 2, final auto-scrolling chase in Level 3, and confetti ending.

## Public APIs / Interfaces / Types
Implemented contracts:
- `src/types/level.ts`: `LevelDefinition`, `PlatformDefinition`, `GoalDefinition`, `CheckpointDefinition`, `SpringDefinition`, `AutoScrollDefinition`.
- `src/types/hazard.ts`: `HazardDefinition`, `HazardType`, `HazardPathNode`.
- `src/types/boss.ts`: `BossEventDefinition`.
- `src/types/player.ts`: `PlayerState`.
- `src/scenes/BaseLevelScene.ts`: `loadLevel(def)`, `registerHazards()`, `handlePlayerHit()`, `respawnAtCheckpoint()`, `triggerBossCutscene()`, `completeLevel()`.

## Task Breakdown (Status)
- [x] Project bootstrap with Phaser + TypeScript + Vite.
- [x] Core folder/scene architecture.
- [x] Keyboard input and monkey movement (coyote time, jump buffer).
- [x] Health/damage/checkpoint system.
- [x] Hazard systems (falling objects, boulders, snails, fire plants, springs).
- [x] Golden banana goal and proximity trigger.
- [x] Boss cutscene theft behavior for early levels.
- [x] Level 1 content pass.
- [x] Level 2 content pass.
- [x] Level 3 auto-scrolling chase.
- [x] Endgame confetti + win UI.
- [x] Asset strategy with placeholders and attribution doc.
- [x] HUD and UX controls (hearts, level label, pause, restart).
- [x] Build verification.
- [x] Setup/run documentation.

## Follow-Up Task Items
- [ ] Integrate a specific free art/audio pack (for example, Kenney Platformer Pack Redux and matching SFX).
- [ ] Decide whether hearts reset each level or persist across all 3 levels, then implement the selected behavior.
- [ ] Add input expansion: keyboard remapping and gamepad support.

## Test Cases and Scenarios
Manual checks to run each release:
1. Movement baseline: platform jumps are reliable in all levels.
2. Hazard collisions: all hazard types apply damage/launch effects.
3. Checkpoint logic: respawn at latest activated checkpoint.
4. Heart depletion: zero hearts restarts current level.
5. Boss trigger guard: theft cutscene triggers once per boss level.
6. Level transitions: `level-1` -> `level-2` -> `level-3`.
7. Auto-scroll fail condition: falling behind causes damage/respawn.
8. Final objective: hidden final banana triggers confetti/win scene.
9. Restart path: restart from win scene works.
10. Placeholder safety: no missing texture keys at runtime.
11. Browser smoke test: works in desktop Chromium/Safari.
12. Performance smoke test: playable frame rate during hazard/confetti bursts.

## Assumptions and Defaults
- Engine: Phaser 3 + TypeScript.
- Scope: 3-level vertical slice.
- Target platform: desktop web browser.
- Controls: keyboard.
- Failure model: 3 hearts + checkpoints.
- Boss in Levels 1/2: scripted theft cutscene.
- Final level: auto-scrolling escape/chase.
- Assets: procedural placeholders now, free pack replacement path documented.
- No persistent save system in this slice.
- Single-player only.
