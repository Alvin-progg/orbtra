"use client";

import React, { useEffect, useRef, useState } from "react";



export interface OrbitContentItem {
  id?: string | number;
  content: React.ReactNode;
}

export interface OrbitImageItem {
  id?: string | number;
  src: string;
  alt?: string;
  size?: number;
  imageStyle?: React.CSSProperties;
}

export type OrbitItem = OrbitContentItem | OrbitImageItem | string;

export interface OrbitLayer {
  items: OrbitItem[];
  radius: number;
  speed?: number; // multiplier per layer
  direction?: "clockwise" | "counterclockwise";
  itemSize?: number;
  ellipseRatio?: number;
  depthStrength?: number;
  axisRotation?: number;
  axisRotationSpeed?: number;
  axisTilt?: number;
  axisTiltRange?: number;
  axisTiltSpeed?: number;
}

export interface OrbitProps {
  layers: OrbitLayer[];
  size?: number;
  globalSpeed?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  clientOnly?: boolean;
  fallback?: React.ReactNode;
  depthEffect?: boolean;
  ellipseRatio?: number;
  axisRotation?: number;
  axisRotationSpeed?: number;
  axisTilt?: number;
  axisTiltRange?: number;
  axisTiltSpeed?: number;
  initialCircle?: boolean;
  interactiveAxis?: boolean;
  dragToRotateAxis?: boolean;
  pointerInfluence?: number;
  dragSensitivity?: number;
  minItemScale?: number;
  maxItemScale?: number;
  minItemOpacity?: number;
  maxBlurPx?: number;
  centerZIndex?: number;
  centerElement?: React.ReactNode;
  centerImageSrc?: string;
  centerImageAlt?: string;
  centerSize?: number;
  centerStyle?: React.CSSProperties;
}



const DEFAULT_ITEM_SIZE = 36;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function isContentItem(item: OrbitItem): item is OrbitContentItem {
  return typeof item === "object" && item !== null && "content" in item;
}

function isImageItem(item: OrbitItem): item is OrbitImageItem {
  return typeof item === "object" && item !== null && "src" in item;
}

const Orbtra = ({
  layers,
  size = 400,
  globalSpeed = 0.01,
  pauseOnHover = false,
  className = "",
  style,
  clientOnly = true,
  fallback = null,
  depthEffect = true,
  ellipseRatio = 1,
  axisRotation = 0,
  axisRotationSpeed = 0,
  axisTilt = 22,
  axisTiltRange = 14,
  axisTiltSpeed = 0.55,
  initialCircle = false,
  interactiveAxis = true,
  dragToRotateAxis = true,
  pointerInfluence = 8,
  dragSensitivity = 0.14,
  minItemScale = 0.75,
  maxItemScale = 1.08,
  minItemOpacity = 0.5,
  maxBlurPx = 1.6,
  centerZIndex = 20000,
  centerElement,
  centerImageSrc,
  centerImageAlt = "center image",
  centerSize = 72,
  centerStyle,
}: OrbitProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [angle, setAngle] = useState(0);
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [dragAxisOffset, setDragAxisOffset] = useState({ x: 0, y: 0 });
  const [isDraggingAxis, setIsDraggingAxis] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const frameRef = useRef<number | null>(null);
  const isPaused = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  const animate = () => {
    if (!isPaused.current) {
      setAngle((prev) => prev + globalSpeed);
    }
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [globalSpeed]);

  const safeMinScale = Math.max(0.1, Math.min(minItemScale, maxItemScale));
  const safeMaxScale = Math.max(safeMinScale, Math.max(minItemScale, maxItemScale));
  const safeMinOpacity = clamp(minItemOpacity, 0, 1);
  const safeMaxBlurPx = Math.max(0, maxBlurPx);
  const safePointerInfluence = Math.max(0, pointerInfluence);
  const safeDragSensitivity = Math.max(0, dragSensitivity);

  const updatePointerPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveAxis) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setPointerPosition({
      x: clamp(normalizedX, -1, 1),
      y: clamp(normalizedY, -1, 1),
    });
  };

  const clearAxisDragState = () => {
    setIsDraggingAxis(false);
    lastPointerRef.current = null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveAxis || !dragToRotateAxis) {
      return;
    }

    if (initialCircle && !hasInteracted) {
      setHasInteracted(true);
    }

    updatePointerPosition(event);
    setIsDraggingAxis(true);
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    updatePointerPosition(event);

    if (initialCircle && !hasInteracted) {
      setHasInteracted(true);
    }

    if (!interactiveAxis || !dragToRotateAxis || !isDraggingAxis || !lastPointerRef.current) {
      return;
    }

    const deltaX = event.clientX - lastPointerRef.current.x;
    const deltaY = event.clientY - lastPointerRef.current.y;

    setDragAxisOffset((previous) => ({
      x: clamp(previous.x + deltaY * safeDragSensitivity, -89, 89),
      y: previous.y + deltaX * safeDragSensitivity,
    }));

    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactiveAxis) {
      return;
    }

    clearAxisDragState();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerLeave = () => {
    clearAxisDragState();

    if (interactiveAxis) {
      setPointerPosition({ x: 0, y: 0 });
    }
  };

  const renderCenter = () => {
    if (centerElement) {
      return centerElement;
    }

    if (centerImageSrc) {
      return (
        <img
          src={centerImageSrc}
          alt={centerImageAlt}
          style={{
            width: centerSize,
            height: centerSize,
            objectFit: "contain",
            display: "block",
            ...centerStyle,
          }}
        />
      );
    }

    return null;
  };

  const centerNode = renderCenter();

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: size,
    height: size,
    overflow: "visible",
    ...style,
  };

  const renderOrbitItem = (item: OrbitItem, layerItemSize?: number) => {
    if (isContentItem(item)) {
      return item.content;
    }

    const defaultSize = layerItemSize ?? DEFAULT_ITEM_SIZE;

    if (typeof item === "string") {
      return (
        <img
          src={item}
          alt="orbit item"
          style={{
            width: defaultSize,
            height: defaultSize,
            objectFit: "contain",
            display: "block",
          }}
        />
      );
    }

    if (isImageItem(item)) {
      return (
        <img
          src={item.src}
          alt={item.alt ?? "orbit item"}
          style={{
            width: item.size ?? defaultSize,
            height: item.size ?? defaultSize,
            objectFit: "contain",
            display: "block",
            ...item.imageStyle,
          }}
        />
      );
    }

    return null;
  };

  if (clientOnly && !isMounted) {
    return (
      <div className={className} style={containerStyle} aria-hidden>
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={containerStyle}
      onMouseEnter={() => pauseOnHover && (isPaused.current = true)}
      onMouseLeave={() => {
        if (pauseOnHover) {
          isPaused.current = false;
        }
        handlePointerLeave();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {centerNode ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: centerZIndex,
          }}
        >
          {centerNode}
        </div>
      ) : null}

      {layers.map((layer, layerIndex) => {
        const {
          items,
          radius,
          speed = 1,
          direction = "clockwise",
          itemSize,
          ellipseRatio: layerEllipseRatio,
          depthStrength = 1,
          axisRotation: layerAxisRotation,
          axisRotationSpeed: layerAxisRotationSpeed,
        } = layer;

        if (items.length === 0) {
          return null;
        }

        const directionMultiplier = direction === "clockwise" ? 1 : -1;
        const orbitEllipse = clamp(layerEllipseRatio ?? ellipseRatio, 0.1, 1);
        const orbitDepthStrength = clamp(depthStrength, 0, 1);
        const orbitAxisRotation = toRadians(layerAxisRotation ?? axisRotation);
        const orbitAxisRotationSpeed = layerAxisRotationSpeed ?? axisRotationSpeed;
        const orbitAxisTilt = layer.axisTilt ?? axisTilt;
        const orbitAxisTiltRange = layer.axisTiltRange ?? axisTiltRange;
        const orbitAxisTiltSpeed = layer.axisTiltSpeed ?? axisTiltSpeed;

        const isNeutralInitialState = initialCircle && !hasInteracted;
        const baseAxisTilt = isNeutralInitialState ? 0 : orbitAxisTilt;
        const baseAxisTiltRange = isNeutralInitialState ? 0 : orbitAxisTiltRange;

        const pointerTiltX = interactiveAxis ? pointerPosition.y * safePointerInfluence : 0;
        const pointerTiltY = interactiveAxis ? pointerPosition.x * safePointerInfluence : 0;
        const dragTiltX = dragToRotateAxis ? dragAxisOffset.x : 0;
        const dragTiltY = dragToRotateAxis ? dragAxisOffset.y : 0;

        return items.map((item, i) => {
          const itemKey =
            typeof item === "string" ? `${item}-${i}` : (item.id ?? i);

          const itemAngle =
            angle * speed * directionMultiplier +
            (i * (2 * Math.PI)) / items.length;

          const baseX = radius * Math.cos(itemAngle);
          const baseY = radius * Math.sin(itemAngle) * orbitEllipse;
          const baseZ = radius * Math.sin(itemAngle);

          const dynamicAxisAngle = orbitAxisRotation + angle * orbitAxisRotationSpeed;
          const dynamicAxisTilt =
            baseAxisTilt +
            Math.sin(angle * orbitAxisTiltSpeed + layerIndex) * baseAxisTiltRange +
            pointerTiltY +
            dragTiltY;
          const dynamicAxisPitch = isNeutralInitialState ? 0 : pointerTiltX + dragTiltX * 0.7;

          const tiltYRadians = toRadians(dynamicAxisTilt);
          const tiltXRadians = toRadians(dynamicAxisPitch);

          const cosY = Math.cos(tiltYRadians);
          const sinY = Math.sin(tiltYRadians);
          const yTiltX = baseX * cosY + baseZ * sinY;
          const yTiltZ = -baseX * sinY + baseZ * cosY;

          const cosX = Math.cos(tiltXRadians);
          const sinX = Math.sin(tiltXRadians);
          const xTiltY = baseY * cosX - yTiltZ * sinX;
          const xTiltZ = baseY * sinX + yTiltZ * cosX;

          const axisCos = Math.cos(dynamicAxisAngle);
          const axisSin = Math.sin(dynamicAxisAngle);
          const x = yTiltX * axisCos - xTiltY * axisSin;
          const y = yTiltX * axisSin + xTiltY * axisCos;
          const z = xTiltZ;

          const rawDepth = clamp((z / Math.max(1, radius) + 1) / 2, 0, 1);
          const depth = depthEffect
            ? clamp(0.5 + (rawDepth - 0.5) * orbitDepthStrength, 0, 1)
            : 0.5;
          const itemScale = depthEffect
            ? safeMinScale + depth * (safeMaxScale - safeMinScale)
            : 1;
          const itemOpacity = depthEffect
            ? safeMinOpacity + depth * (1 - safeMinOpacity)
            : 1;
          const itemBlur = depthEffect ? (1 - depth) * safeMaxBlurPx : 0;
          const itemZIndex = 1000 + Math.round(depth * 100000) + layerIndex * 100 + i;

          return (
            <div
              key={`${layerIndex}-${itemKey}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${itemScale})`,
                willChange: "transform",
                opacity: itemOpacity,
                filter: itemBlur > 0 ? `blur(${itemBlur.toFixed(2)}px)` : undefined,
                zIndex: itemZIndex,
              }}
            >
              {renderOrbitItem(item, itemSize)}
            </div>
          );
        });
      })}
    </div>
  );
};

export default Orbtra;

