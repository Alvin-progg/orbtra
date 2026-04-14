# Orbtra

Created by Alvin-progg

Multi-layer orbiting React component for logos, avatars, and custom UI nodes.

Published package: `orbtra`

## Install

```bash
npm i orbtra
```

## Quick Start

```tsx
import { Orbit } from "orbtra";

const techstack = [
  "https://cdn.simpleicons.org/react",
  "https://cdn.simpleicons.org/typescript",
  "https://cdn.simpleicons.org/node.js",
  "https://cdn.simpleicons.org/python",
  "https://cdn.simpleicons.org/docker",
  "https://cdn.simpleicons.org/postgresql",
  "https://cdn.simpleicons.org/github",
  "https://cdn.simpleicons.org/vercel",
];

export function App() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Orbit
        size={460}
        globalSpeed={0.012}
        pauseOnHover
        depthEffect
        ellipseRatio={1}
        axisRotation={12}
        axisRotationSpeed={0.35}
        axisTilt={24}
        axisTiltRange={16}
        axisTiltSpeed={0.6}
        interactiveAxis
        dragToRotateAxis
        pointerInfluence={9}
        dragSensitivity={0.14}
        minItemScale={0.72}
        maxItemScale={1.1}
        minItemOpacity={0.45}
        maxBlurPx={1.8}
        layers={[
          {
            radius: 150,
            itemSize: 38,
            speed: 0.3,
            direction: "clockwise",
            depthStrength: 1,
            axisRotationSpeed: 0.2,
            items: techstack,
          },
          {
            radius: 180,
            itemSize: 42,
            speed: 0.3,
            direction: "counterclockwise",
            depthStrength: 0.85,
            axisRotation: -20,
            axisRotationSpeed: 0.2,
            items: techstack,
          },
        ]}
      />
    </div>
  );
}
```

## Notes

- Pure 2D rendering with faux 3D depth via scale, opacity, blur, and z-index.
- Overlap is depth-layered so front items cover back items while moving.
- No center sphere is rendered by default.
- Distorted startup is default. Set `initialCircle` for clean ring-first behavior.

## SSR / Hydration

Orbtra uses client-only rendering by default to avoid hydration mismatch warnings in SSR frameworks like Next.js.

- Default: `clientOnly={true}`
- Optional placeholder before hydration: `fallback={<div style={{ width: 460, height: 460 }} />}`
- If you need SSR markup, set `clientOnly={false}` and keep input deterministic on server and client.

## Item Formats

Each layer supports mixed item formats:

- String URL: `"https://.../logo.png"`
- Image object: `{ src, alt, size, imageStyle }`
- Custom content object: `{ content: <YourNode /> }`

## Local Development

```bash
npm run check:package
```


