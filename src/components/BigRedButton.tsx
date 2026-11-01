import { Box } from '@mantine/core';
import type { Flash } from '../game/useRhythmLock';

interface Props {
  flash: Flash;
  disabled?: boolean;
  onPress: () => void;
}

export function BigRedButton({ flash, disabled, onPress }: Props) {
  return (
    <Box
      component="button"
      type="button"
      aria-label="Big red button"
      disabled={disabled}
      // pointerdown rather than click: less latency, matters for timing.
      onPointerDown={(e: React.PointerEvent) => {
        e.preventDefault();
        onPress();
      }}
      style={{
        width: 240,
        height: 240,
        borderRadius: '50%',
        border: '8px solid rgba(0,0,0,0.35)',
        background: flash === 'green' ? '#2fb344' : '#e03131',
        boxShadow: '0 10px 0 rgba(0,0,0,0.4)',
        cursor: 'pointer',
        transition: flash === 'green' ? 'none' : 'background 150ms',
        touchAction: 'manipulation',
      }}
    />
  );
}
