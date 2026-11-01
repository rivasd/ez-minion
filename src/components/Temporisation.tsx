import { Center, Stack, Title } from '@mantine/core';
import { SECRET_PHRASE } from '../game/config';
import { useRhythmLock } from '../game/useRhythmLock';
import { BigRedButton } from './BigRedButton';

const MINION_YELLOW = '#FFD90F';
const SETUP_GREEN = '#2fb344';

export function Temporisation() {
  const { mode, flash, press } = useRhythmLock();

  return (
    <Center
      h="100%"
      style={{
        background: mode === 'setup' ? SETUP_GREEN : MINION_YELLOW,
        transition: 'background 300ms',
      }}
    >
      <Stack align="center" gap="xl">
        <Title order={1} c="dark.9" style={{ letterSpacing: '0.25em' }}>
          TEMPORISATION
        </Title>
        <BigRedButton flash={flash} disabled={mode === 'solved'} onPress={press} />
        {/* Reserve space so the layout doesn't shift when the phrase appears. */}
        <Title order={2} ta="center" c="dark.9" mih={40}>
          {mode === 'solved' ? SECRET_PHRASE : ''}
        </Title>
      </Stack>
    </Center>
  );
}

