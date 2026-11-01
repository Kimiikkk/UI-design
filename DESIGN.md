---
name: Empire UI
description: A monochrome landing page built from dotted lettering and physical-feeling spheres.
colors:
  neutral-bg: "#050505"
  neutral-fg: "#f7f7f7"
  white: "#ffffff"
  muted: "#d7d7d7"
  sphere-mid: "#c9c9c9"
  sphere-shadow: "#999999"
typography:
  display:
    fontFamily: "Space Mono, Courier New, monospace"
    fontSize: "clamp(86px, 15.1vw, 218px)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.105em"
  headline:
    fontFamily: "Space Mono, Courier New, monospace"
    fontSize: "clamp(34px, 5.05vw, 74px)"
    fontWeight: 700
    lineHeight: 1.13
  body:
    fontFamily: "Space Mono, Courier New, monospace"
    fontSize: "clamp(13px, 1.58vw, 20px)"
    lineHeight: 1.75
    letterSpacing: "-0.055em"
rounded:
  pill: "999px"
spacing:
  page-x: "clamp(44px, 5.65vw, 94px)"
  mobile-x: "30px"
components:
  community-link:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.pill}"
    height: "50px"
    padding: "0 20px"
---

## Overview

The page translates the supplied black-and-white Empire UI reference into a single-screen landing surface. Repeated dots shape the lettering and perimeter; softly shaded spheres provide the dimensional motion. Keep the field dense across the lower portion while preserving clear space around the copy.

## Colors

### Primary
- **Snow** (#f7f7f7): dotted lettering and primary copy against the black stage.

### Neutral
- **Near black** (#050505): the uninterrupted stage and CTA background.
- **White** (#ffffff): the border dots, brightest letter dots, and sphere highlights.
- **Muted** (#d7d7d7): small interaction guidance.
- **Sphere middle** (#c9c9c9): the central reflective surface of each ball.
- **Sphere shadow** (#999999): the outside rolloff that rounds each sphere.

## Typography

**Display Font:** Space Mono (with Courier New and monospace fallback)  
**Body Font:** Space Mono (with Courier New and monospace fallback)

**Character:** Monospaced forms are filled with a repeating dot field. Hierarchy comes from dot scale, type size, and whitespace.

### Hierarchy
- **Display** (700, clamp(86px, 15.1vw, 218px), .92): the large “Empire UI” statement.
- **Headline** (700, clamp(34px, 5.05vw, 74px), 1.13): the short “Why Empire UI” title.
- **Body** (400, clamp(13px, 1.58vw, 20px), 1.75): explanatory copy, sized down at mobile widths.
- **Label** (400, 10px, .1em, uppercase): the small pointer interaction cue.

### Named Rules
**The Dot Field Rule.** Display and supporting copy use dotted fills; avoid solid display lettering on this surface.

## Layout

The first screen uses a full-viewport black canvas with the copy at the upper left, a large wordmark statement through the middle, and the community action at the lower left. Keep the right half open. The sphere field sits behind the wordmark and occupies the bottom area. A 680px breakpoint tightens the outer padding and scales the wordmark to fit phones; short desktop viewports reduce the top and bottom spacing.

## Elevation & Depth

There are no card surfaces. Sphere depth comes from an opaque radial highlight-to-shadow color ramp, a moving specular reflection, and a faint 4px edge shadow. Near the field, the pointer becomes a 52px bright-white sphere without an outer corona. Nearby balls gain their own soft white aura according to distance from the source; only lighting radii change, never the physical sphere sizes. Avoid a hard flare or rays.

## Shapes

The perimeter is a chain of evenly spaced dots. Spheres are circular. The community action is the only pill shape, with a thin white stroke and black fill.

## Components

### Community link
- **Shape:** outline pill (999px).
- **Primary:** black background, white text, 50px minimum height, 20px horizontal padding.
- **Hover / Focus:** invert to white on hover; use a clearly offset white keyboard ring.

### Sphere field
- **Form:** solid, opaque glossy spheres, procedurally rendered on canvas as five staggered depth layers. The rear layers sit higher and scale down; the front layer draws last and occludes them.
- **Behavior:** a responsive field of up to 130 balls with gravity, same-layer collisions, edge bounce, and pointer repulsion. Near a ball, the pointer becomes a 52px bright-white sphere without an outer aura; only nearby balls acquire progressive white auras and reflected highlights within a 180px falloff. Sphere radii remain fixed; honor reduced-motion preferences.

## Do's and Don'ts

### Do:
- **Do** keep the base nearly black and the contrast monochrome.
- **Do** use dots as a consistent lettering and perimeter material.
- **Do** keep the right side visually open and let the sphere field remain interactive.

### Don't:
- **Don't** add a person or competing hero image to the open right side.
- **Don't** invent product metrics or performance claims.
- **Don't** replace the spheres with static decorative circles.
