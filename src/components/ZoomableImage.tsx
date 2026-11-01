import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { IconMinus, IconPlus, IconZoomReset } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_SCALE = 6;
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

interface View {
  s: number;
  x: number;
  y: number;
}

/** Photo that stays in its slot; wheel / buttons / double-click zoom, drag pans. */
export function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ px: 0, py: 0, x: 0, y: 0 });

  // Track the slot size so the stage can letterbox the photo (object-fit: contain).
  useEffect(() => {
    const el = containerRef.current!;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = nat && box.w && box.h ? Math.min(box.w / nat.w, box.h / nat.h) : 0;
  const stage = nat && fit ? { w: nat.w * fit, h: nat.h * fit } : { w: box.w, h: box.h };
  const stageDims = useRef(stage);
  stageDims.current = stage;

  const constrain = (s: number, x: number, y: number): View => {
    const { w, h } = stageDims.current;
    return { s, x: clamp(x, w - w * s, 0), y: clamp(y, h - h * s, 0) };
  };

  // Zoom keeping the point (px, py), in stage coordinates, fixed on screen.
  const zoomAt = useCallback((factor: number, px: number, py: number) => {
    setView((v) => {
      const s = clamp(v.s * factor, 1, MAX_SCALE);
      const ratio = s / v.s;
      const { w, h } = stageDims.current;
      return {
        s,
        x: clamp(px - (px - v.x) * ratio, w - w * s, 0),
        y: clamp(py - (py - v.y) * ratio, h - h * s, 0),
      };
    });
  }, []);

  // Wheel needs a non-passive listener so the page doesn't scroll while zooming.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.25 : 0.8, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt, failed]);

  const centerZoom = (factor: number) => zoomAt(factor, stage.w / 2, stage.h / 2);

  return (
    <Box
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {failed ? (
        <Text c="dark.9" size="sm">
          Photo à venir
        </Text>
      ) : (
        <Box
          ref={stageRef}
          onPointerDown={(e: React.PointerEvent) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            dragStart.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y };
            setDragging(true);
          }}
          onPointerMove={(e: React.PointerEvent) => {
            if (!dragging) return;
            const d = dragStart.current;
            setView((v) => constrain(v.s, d.x + e.clientX - d.px, d.y + e.clientY - d.py));
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onDoubleClick={(e: React.MouseEvent) => {
            const r = e.currentTarget.getBoundingClientRect();
            if (view.s > 1) setView({ s: 1, x: 0, y: 0 });
            else zoomAt(3, e.clientX - r.left, e.clientY - r.top);
          }}
          style={{
            width: stage.w,
            height: stage.h,
            overflow: 'hidden',
            cursor: dragging ? 'grabbing' : view.s > 1 ? 'grab' : 'zoom-in',
            touchAction: 'none',
            outline: '1px solid rgba(0,0,0,0.35)',
          }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            onLoad={(e) =>
              setNat({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
            }
            onError={() => setFailed(true)}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              pointerEvents: 'none',
              userSelect: 'none',
              transformOrigin: '0 0',
              transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`,
            }}
          />
        </Box>
      )}
      {!failed && (
        <Group gap={4} style={{ position: 'absolute', right: 8, bottom: 8, zIndex: 1 }}>
          <ActionIcon variant="filled" color="dark" aria-label="Zoom in" onClick={() => centerZoom(1.5)}>
            <IconPlus size={16} />
          </ActionIcon>
          <ActionIcon variant="filled" color="dark" aria-label="Zoom out" onClick={() => centerZoom(1 / 1.5)}>
            <IconMinus size={16} />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            color="dark"
            aria-label="Reset zoom"
            onClick={() => setView({ s: 1, x: 0, y: 0 })}
          >
            <IconZoomReset size={16} />
          </ActionIcon>
        </Group>
      )}
    </Box>
  );
}
