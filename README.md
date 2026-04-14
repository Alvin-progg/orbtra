# Orbtra

Multi-layer orbiting React component.

Use it for tech stacks, avatars, planets, logos, or any other image/content orbiting around a center.

## Install

```bash
npm i orbtra
```

## Example: Circular Orbit With Moving Axis (Faux 3D)

```tsx
import React from "react";
import { Orbit } from "orbtra";

const layer1 = [
  "https://cdn.simpleicons.org/react",
  "https://cdn.simpleicons.org/typescript",
  "https://cdn.simpleicons.org/node.js",
  "https://cdn.simpleicons.org/python",
  "https://cdn.simpleicons.org/docker",
  "https://cdn.simpleicons.org/postgresql",
];

const layer2 = [
  "https://i.pravatar.cc/80?img=1",
  "https://i.pravatar.cc/80?img=2",
  "https://i.pravatar.cc/80?img=3",
  "https://i.pravatar.cc/80?img=4",
  "https://i.pravatar.cc/80?img=5",
  "https://i.pravatar.cc/80?img=6",
];

export function DemoOrbit() {
  return (
    <Orbit
      size={460}
      globalSpeed={0.012}
      initialCircle
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
          radius: 120,
          itemSize: 38,
          speed: 1,
          direction: "clockwise",
          depthStrength: 1,
          axisRotationSpeed: 0.5,
          items: layer1,
        },
        {
          radius: 190,
          itemSize: 42,
          speed: 0.72,
          direction: "counterclockwise",
          depthStrength: 0.85,
          axisRotation: -20,
          axisRotationSpeed: 0.2,
          items: layer2,
        },
      ]}
    />
  );
}
```

This keeps everything 2D, but simulates depth with scale, blur, opacity, and z-index. Overlaps are layered by dynamic depth so front items cover back items while moving.

No center sphere is rendered by default. A center appears only if you provide centerElement or centerImageSrc.

Pointer movement and drag can steer the orbit axis in real time, creating a more satellite-like motion path.

With initialCircle enabled, the first frame starts as a clean circle and the axis tilt kicks in after interaction.

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
