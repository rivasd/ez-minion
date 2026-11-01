import { Box, Group, Stack, Text } from '@mantine/core';
import { useRef, useState } from 'react';
import { BOARD_DIGITS } from '../game/config';

const SIZE = 8;
const LINE = 'rgba(0, 0, 0, 0.35)';
const PATHS = ['le chemin de la pomme', 'le chemin de la banane', 'le chemin du raisin'];

export function GridPanel() {
  // Row-major, top-left first, flattened from BOARD_DIGITS in config.
  const digits = BOARD_DIGITS.flat();
  const [held, setHeld] = useState<number | null>(null);
  const [cell, setCell] = useState({ row: 0, col: 0 });
  // While dragging: pointer position as a 0..1 fraction of the grid.
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const fraction = (e: React.PointerEvent) => {
    const r = gridRef.current!.getBoundingClientRect();
    return {
      x: Math.min(Math.max((e.clientX - r.left) / r.width, 0), 0.9999),
      y: Math.min(Math.max((e.clientY - r.top) / r.height, 0), 0.9999),
    };
  };

  const tokenSize = 100 / SIZE;
  const tokenLeft = drag ? drag.x * 100 - tokenSize / 2 : cell.col * tokenSize;
  const tokenTop = drag ? drag.y * 100 - tokenSize / 2 : cell.row * tokenSize;

  return (
    <Stack h="100%" p="md" gap="sm" align="center" style={{ userSelect: 'none' }}>
      <Box style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box
          ref={gridRef}
          style={{
            position: 'relative',
            height: '100%',
            aspectRatio: '1 / 1',
            maxWidth: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SIZE}, 1fr)`,
            border: `1px solid ${LINE}`,
          }}
        >
          {digits.map((d, i) => (
            <Box
              key={i}
              onPointerDown={() => setHeld(i)}
              onPointerUp={() => setHeld(null)}
              onPointerLeave={() => setHeld((h) => (h === i ? null : h))}
              onPointerCancel={() => setHeld(null)}
              style={{
                // Chessboard: alternate light/dark squares.
                background:
                  (Math.floor(i / SIZE) + (i % SIZE)) % 2 === 0
                    ? 'rgba(255,255,255,0.55)'
                    : 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 'clamp(12px, 3vh, 28px)',
                color: (Math.floor(i / SIZE) + (i % SIZE)) % 2 === 0 ? '#000' : '#fff',
                cursor: 'pointer',
              }}
            >
              {held === i ? (d ?? '') : ''}
            </Box>
          ))}
          <Box
            onPointerDown={(e: React.PointerEvent) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setHeld(null);
              setDrag(fraction(e));
            }}
            onPointerMove={(e: React.PointerEvent) => drag && setDrag(fraction(e))}
            onPointerUp={(e: React.PointerEvent) => {
              if (!drag) return;
              const { x, y } = fraction(e);
              setCell({ row: Math.floor(y * SIZE), col: Math.floor(x * SIZE) });
              setDrag(null);
            }}
            onPointerCancel={() => setDrag(null)}
            style={{
              position: 'absolute',
              left: `${tokenLeft}%`,
              top: `${tokenTop}%`,
              width: `${tokenSize}%`,
              height: `${tokenSize}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: drag ? 'grabbing' : 'grab',
              touchAction: 'none',
              zIndex: 1,
            }}
          >
            <Box
              style={{
                width: '80%',
                height: '80%',
                borderRadius: '50%',
                background: '#FFD90F',
                border: '2px solid var(--mantine-color-dark-9)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
              }}
            />
          </Box>
        </Box>
      </Box>

      <Group gap="xs" wrap="nowrap">
        {Array.from({ length: 5 }, (_, i) => (
          <Box
            key={i}
            style={{
              width: 'clamp(24px, 4.5vh, 44px)',
              aspectRatio: '5 / 7',
              border: `2px solid ${LINE}`,
              borderRadius: 6,
            }}
          />
        ))}
      </Group>

      <Stack gap={0} align="center">
        {PATHS.map((p) => (
          <Text key={p} c="dark.9" fw={600} size="sm">
            {p}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
}
