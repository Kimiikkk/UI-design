---
name: Empire UI
description: A monochrome product landing page with Minecraft-inspired pixel typography, a dotted card reveal, and interactive solid spheres.
colors:
  neutral-bg: "#050505"
  neutral-fg: "#f7f7f7"
  white: "#ffffff"
  muted: "#d7d7d7"
  sphere-mid: "#c9c9c9"
  sphere-shadow: "#999999"
typography:
  display:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "clamp(86px, 15.1vw, 218px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "clamp(34px, 5.05vw, 74px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: ".02em"
  body:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "clamp(15px, 1.35vw, 18px)"
    lineHeight: 1.8
    letterSpacing: ".02em"
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

The page translates the supplied black-and-white Empire UI reference into a scrollable product landing page. Product highlights lead into a hero with Minecraft-inspired Pixelify Sans lettering, a dotted perimeter, and softly shaded spheres that respond to the pointer. Keep the lower sphere field dense while preserving readable space around the copy.

## Colors

### Primary
- **Snow** (#f7f7f7): pixel lettering and primary copy against the black stage.

### Neutral
- **Near black** (#050505): the uninterrupted stage and CTA background.
- **White** (#ffffff): border dots, card matrix animation, and sphere highlights.
- **Muted** (#d7d7d7): small interaction guidance.
- **Sphere middle** (#c9c9c9): the central reflective surface of each ball.
- **Sphere shadow** (#999999): the outside rolloff that rounds each sphere.

## Typography

**Display Font:** Pixelify Sans (self-hosted, with Courier New and monospace fallback)  
**Body Font:** Pixelify Sans (self-hosted, with Courier New and monospace fallback)  

**Character:** Blocky pixel forms carry the Minecraft-inspired voice. Hierarchy comes from pixel scale, type size, and whitespace; repeated dots remain in the perimeter and card reveal.

### Hierarchy
- **Display** (700, clamp(86px, 15.1vw, 218px), 1): the large “Empire UI” statement.
- **Headline** (700, clamp(34px, 5.05vw, 74px), 1.25): the short “Why Empire UI” title.
- **Body** (400, clamp(15px, 1.35vw, 18px), 1.8): explanatory copy, sized down at mobile widths.
- **Label** (400, 10px, .1em, uppercase): the small pointer interaction cue.

### Named Rules
**The Pixel Voice Rule.** Use solid Pixelify Sans for Minecraft-inspired lettering. Reserve dot patterns for the perimeter and the slow radial card reveal so body copy remains readable.

## Layout

The product highlights section sits above the full-viewport hero. In the hero, copy anchors the upper left, a large wordmark crosses the middle, and the community action sits at the lower left. Keep the right half visually open. The sphere field sits behind the wordmark and occupies the bottom area. A 680px breakpoint stacks the product cards and scales the wordmark for phones; vertical scrolling remains available over the sphere field.

## Elevation & Depth

Product cards use their source imagery with white outlines, a dark label strip, and a slow dot-matrix reveal on hover or keyboard focus. Sphere depth comes from an opaque radial highlight-to-shadow color ramp, a moving specular reflection, and a faint 4px edge shadow. Near the field, the pointer becomes a 52px bright-white sphere without an outer corona. Nearby balls gain their own soft white aura according to distance from the source; only lighting radii change, never the physical sphere sizes. Avoid a hard flare or rays.

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
- **Do** use Pixelify Sans for the Minecraft-inspired letterforms and dots for the perimeter and card reveal.
- **Do** keep the right side visually open and let the sphere field remain interactive.

### Don't:
- **Don't** add a person or competing hero image to the open right side.
- **Don't** invent product metrics or performance claims.
- **Don't** replace the spheres with static decorative circles.
