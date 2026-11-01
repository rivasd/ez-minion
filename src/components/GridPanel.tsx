import { ActionIcon, Box, Group, Stack, Text, Title } from '@mantine/core';
import { IconCheck, IconQuestionMark } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { BOARD_DIGITS, PATH_POSITIONS } from '../game/config';

const SIZE = 8;
const LINE = 'rgba(0, 0, 0, 0.35)';
const PATHS = ['le chemin de la pomme', 'le chemin de la banane', 'le chemin du raisin'];

export function GridPanel() {
  // Row-major, top-left first, flattened from BOARD_DIGITS in config.
  const digits = BOARD_DIGITS.flat();
  const [held, setHeld] = useState<number | null>(null);
  const [cell, setCell] = useState({ row: 0, col: 0 });
  const [pathDone, setPathDone] = useState<boolean[]>(PATHS.map(() => false));
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
      <Title order={1} c="dark.9" ta="center" style={{ letterSpacing: '0.25em' }}>
        Les chemins de cartes
      </Title>
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
          {/* Label for the start square, above the token; clicks pass through. */}
          {held !== 0 && (
            <Box
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${tokenSize}%`,
                height: `${tokenSize}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(8px, 1.5vh, 14px)',
                fontWeight: 800,
                color: 'var(--mantine-color-dark-9)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              Début
            </Box>
          )}
        </Box>
      </Box>

      <Group justify="space-around" align="flex-start" wrap="nowrap" w="100%">
        {PATHS.map((label, i) => (
          <Stack key={label} align="center" gap={4} w="30%">
            <ActionIcon
              size={48}
              radius="xl"
              variant="filled"
              color={pathDone[i] ? 'green' : 'blue'}
              aria-disabled={pathDone[i]}
              aria-label={label}
              // Raised-button look: dark rim and a hard drop shadow; pressing sinks it.
              style={{
                border: '3px solid var(--mantine-color-dark-9)',
                boxShadow: pathDone[i] ? 'none' : '0 5px 0 rgba(0, 0, 0, 0.45)',
                transform: pathDone[i] ? 'translateY(5px)' : undefined,
                cursor: pathDone[i] ? 'default' : 'pointer',
              }}
              onClick={() => {
                if (pathDone[i]) return;
                const target = PATH_POSITIONS[i];
                if (target && target.row === cell.row && target.col === cell.col) {
                  setPathDone((d) => d.map((v, j) => (j === i ? true : v)));
                } else {
                  setCell({ row: 0, col: 0 }); // wrong square: token goes back to the start
                }
              }}
            >
              {pathDone[i] ? <IconCheck size={26} /> : <IconQuestionMark size={26} />}
            </ActionIcon>
            <Text c="dark.9" fw={600} size="sm" ta="center">
              {label}
            </Text>
          </Stack>
        ))}
      </Group>
    </Stack>
  );
}
