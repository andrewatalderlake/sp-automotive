"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Three.js animated point grid scoped to its parent section. Adapted from
// the user-provided DottedSurface to:
//   1. Live inside its parent (absolute inset-0) instead of fixed viewport-
//      wide, so the dots only appear behind section 06.
//   2. Render at the parent's bounding-box size (not the window), with a
//      ResizeObserver keeping the canvas in sync.
//   3. Pause the rAF loop entirely when the parent is off-screen
//      (IntersectionObserver) — Three.js otherwise renders at 60fps even
//      when the section is far above the viewport.
//   4. Drop next-themes dependency (project is dark-only) and hardcode the
//      light-gray dot color.
//
// Z-index sits at -z-0 inside a section that has `position: relative` and
// children with `relative z-10` — content paints above the canvas without
// either side needing explicit stacking context.

type Props = Omit<React.ComponentProps<"div">, "ref">;

const SEPARATION = 150;
const AMOUNTX = 40;
const AMOUNTY = 60;

export function SectionDottedSurface({ className, ...props }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial size from the container, not the window.
    const initialRect = container.getBoundingClientRect();
    let width = Math.max(1, initialRect.width);
    let height = Math.max(1, initialRect.height);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 2000, 10000);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Build geometry once. We'll mutate the Y component each frame.
    const positions: number[] = [];
    const colors: number[] = [];
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, 0, z);
        // Dark-mode light dot color (rgb 200,200,200 in 0..255).
        colors.push(200 / 255, 200 / 255, 200 / 255);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let rafId = 0;
    let visible = false;

    function animate() {
      const positionAttribute = geometry.attributes.position;
      const arr = positionAttribute.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          arr[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;

      // Re-queue ONLY while the section is in viewport. When it scrolls
      // out, the IntersectionObserver flips `visible` to false and the
      // loop falls through, dropping GPU usage to zero.
      if (visible) rafId = requestAnimationFrame(animate);
    }

    function startLoop() {
      if (rafId) return;
      rafId = requestAnimationFrame(animate);
    }
    function stopLoop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    // Respect reduced motion: render one static frame and never start the
    // rAF loop. Declared before the IO so its callback closure sees it.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      renderer.render(scene, camera);
    }

    // Visibility gate.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const wasVisible = visible;
          visible = e.isIntersecting;
          if (!wasVisible && visible && !reduced) startLoop();
          else if (wasVisible && !visible) stopLoop();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(container);

    // Resize gate — keep canvas + camera aligned with the container.
    const ro = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    ro.observe(container);

    return () => {
      io.disconnect();
      ro.disconnect();
      stopLoop();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-0", className)}
      {...props}
    />
  );
}

export default SectionDottedSurface;
