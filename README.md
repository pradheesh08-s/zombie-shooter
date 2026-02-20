# Neon Zombie Survival

Professional neon-themed 2D zombie survival shooter with advanced enemy variants, multi-weapon combat, wave progression, power-ups, boss waves, and local leaderboard persistence.

## Controls
- Move: configurable (default `W A S D`)
- Aim: mouse
- Shoot: left click
- Dodge Roll: configurable (default `Space`)
- Reload: configurable (default `R`)
- Pause: configurable (default `Esc`)
- Weapon Switch: `1` Pistol, `2` Shotgun, `3` Assault Rifle, `4` Sniper

## Game Modes
- **Survival**: endless wave progression
- **Time Attack**: score as much as possible before timer expires
- **Hardcore**: one strict life setup with higher lethality

## Zombie Variants
- Green: Basic zombie (slow, lower health)
- Red: Fast zombie (high speed / dash behavior)
- Purple: Tank zombie (high health, heavy hit)
- Blue: Toxic zombie (explodes on death)
- Yellow: Electric zombie (stuns player on hit)
- Black Boss with red eyes: appears every 5 waves

## Combat Features
- Four weapon classes with independent magazine/reserve ammo
- Weapon upgrade system (damage and fire-rate scaling)
- Headshot bonus scoring
- Combo multiplier scoring
- Hit markers and impact particles
- Reload timing system

## Power-Ups
- Health boost (green)
- Shield (blue aura)
- Double damage (red aura)
- Speed boost (yellow trail)

## UI / Visual Design
- Neon cyberpunk HUD with glassmorphism panels
- Dynamic health gradient bar (green → yellow → red)
- Ammo, score, wave, mode, combo, timer indicators
- Mini-map style battlefield radar
- Dynamic rain/fog atmosphere and low-health screen effect
- Screen shake on heavy impacts/explosions

## Technical Notes
- `requestAnimationFrame` game loop for smooth gameplay
- Collision detection for bullets, zombies, explosions, and power-ups
- LocalStorage persistence for:
  - Control remapping
  - Leaderboard high scores
- Desktop-first responsive layout with media queries for tablet/mobile
