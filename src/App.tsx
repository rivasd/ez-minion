import { Box } from '@mantine/core';
import { useState } from 'react';
import { CodePanel } from './components/CodePanel';
import { GridPanel } from './components/GridPanel';
import { RedLightImage } from './components/RedLightImage';
import { Section } from './components/Section';
import { Temporisation } from './components/Temporisation';
import type { Mode } from './game/useRhythmLock';

const MINION_YELLOW = '#FFD90F';
const SETUP_GREEN = '#2fb344';
const OUTLINE = '2px solid rgba(77, 171, 247, 0.35)';

export function App() {
  const [mode, setMode] = useState<Mode>('idle');

  return (
    <Box
      h="100vh"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        background: mode === 'setup' ? SETUP_GREEN : MINION_YELLOW,
        transition: 'background 300ms',
      }}
    >
      <Section style={{ borderRight: OUTLINE, borderBottom: OUTLINE }}>
        <Temporisation onModeChange={setMode} />
      </Section>
      <Section style={{ borderBottom: OUTLINE }}>
        <CodePanel />
      </Section>
      <Section style={{ borderRight: OUTLINE }}>
        <GridPanel />
      </Section>
      <Section>
        <RedLightImage />
      </Section>
    </Box>
  );
}


