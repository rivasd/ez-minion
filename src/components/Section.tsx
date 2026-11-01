import { Box } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';

/** One quadrant of the page. */
export function Section({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  return (
    <Box style={{ minWidth: 0, minHeight: 0, overflow: 'auto', ...style }}>{children}</Box>
  );
}
