import { Box } from '@mantine/core';
import type { ReactNode } from 'react';

/** Fixed-size panel so every section is the same size. */
export function Section({ children }: { children: ReactNode }) {
  return (
    <Box
      style={{
        flex: '1 1 0',
        maxWidth: 560,
        height: 640,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      {children}
    </Box>
  );
}
