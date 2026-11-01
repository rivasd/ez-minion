import { Center, Group, Progress, Stack, Title } from '@mantine/core';
import { useEffect } from 'react';
import { SECRET_PHRASE, STREAK_TO_SOLVE } from '../game/config';
import { useRhythmLock } from '../game/useRhythmLock';
import type { Mode } from '../game/useRhythmLock';
import { BigRedButton } from './BigRedButton';

export function Temporisation({ onModeChange }: { onModeChange: (mode: Mode) => void }) {
  const { mode, flash, streak, press } = useRhythmLock();
  useEffect(() => onModeChange(mode), [mode, onModeChange]);

  return (
    <Center h="100%">
      <Stack align="center" gap="xl">
        <Title order={1} c="dark.9" style={{ letterSpacing: '0.25em' }}>
          TEMPORISATION
        </Title>
        <Group gap="xl" align="center" wrap="nowrap">
          <BigRedButton flash={flash} disabled={mode === 'solved'} onPress={press} />
          <Progress
            orientation="vertical"
            value={(streak / STREAK_TO_SOLVE) * 100}
            color="green"
            size="xl"
            h={240}
            aria-label="Consecutive good presses"
          />
        </Group>
        {/* Reserve space so the layout doesn't shift when the phrase appears. */}
        <Title order={2} ta="center" c="dark.9" mih={40}>
          {mode === 'solved' ? SECRET_PHRASE : ''}
        </Title>
      </Stack>
    </Center>
  );
}


