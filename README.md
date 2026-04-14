# Orbtra

Multi-layer orbiting React component.

Use it for tech stacks, avatars, planets, logos, or any other image/content orbiting around a center.

## Install

```bash
import { Orbit } from "orbtra";

const techstack = [
  "https://cdn.simpleicons.org/react",
  "https://cdn.simpleicons.org/typescript",
  "https://cdn.simpleicons.org/node.js",
  "https://cdn.simpleicons.org/python",
  "https://cdn.simpleicons.org/docker",
  "https://cdn.simpleicons.org/postgresql",
  "https://cdn.simpleicons.org/react",
  "https://cdn.simpleicons.org/typescript",
  "https://cdn.simpleicons.org/node.js",
  "https://cdn.simpleicons.org/python",
  "https://cdn.simpleicons.org/docker",
  "https://cdn.simpleicons.org/postgresql",
];

export function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
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
          speed: .3,
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
    </>
  );
}
```

This keeps everything 2D, but simulates depth with scale, blur, opacity, and z-index. Overlaps are layered by dynamic depth so front items cover back items while moving.

No center sphere is rendered by default. A center appears only if you provide centerElement or centerImageSrc.

Pointer movement and drag can steer the orbit axis in real time, creating a more satellite-like motion path.

Distorted startup is the default. If you want a clean ring first, set initialCircle.

## SSR / Hydration Note

Orbtra renders in client-only mode by default to avoid hydration mismatch warnings in SSR frameworks like Next.js.

- Default: `clientOnly={true}`
- Optional placeholder before hydration: `fallback={<div style={{ width: 460, height: 460 }} />}`
- If you want full SSR markup, set `clientOnly={false}` and ensure all props/data are deterministic on server and client.

## Item Formats

Each layer supports mixed item formats:

- String URL: `"https://.../logo.png"`
- Image object: `{ src, alt, size, imageStyle }`
- Custom content object: `{ content: <YourNode /> }`

## Local Package Testing

From this package folder:

```bash
npm run check:package
npm pack
```

Then in your React app:

```bash
npm i ../orbtra/orbtra-1.0.0.tgz
```

Import and render `Orbit` as shown above.
