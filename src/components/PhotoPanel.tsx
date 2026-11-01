import { Box, Button, Group, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { PHOTO_ANSWERS, PHOTO_CLUE, PHOTO_SRC, normalize } from '../game/codeConfig';
import { ZoomableImage } from './ZoomableImage';

export function PhotoPanel() {
  const [values, setValues] = useState<string[]>(PHOTO_ANSWERS.map(() => ''));
  // Per box: index of the answer it matched, or null. Answers can be found in any order,
  // but each answer can only be claimed by one box.
  const [matched, setMatched] = useState<(number | null)[]>(PHOTO_ANSWERS.map(() => null));
  const [wrong, setWrong] = useState<number | null>(null);

  const submit = (i: number) => {
    const j = PHOTO_ANSWERS.findIndex(
      (a, k) => !matched.includes(k) && normalize(a) === normalize(values[i]),
    );
    if (j >= 0) {
      setMatched((m) => m.map((x, b) => (b === i ? j : x)));
      setWrong(null);
    } else {
      setWrong(i);
    }
  };

  const allSolved = matched.every((m) => m !== null);

  return (
    <Stack h="100%" p="md" gap="xs">
      <Title order={1} ta="center" c="dark.9" style={{ letterSpacing: '0.25em' }}>
        QUARTIER GÉNÉRAL
      </Title>
      <Box style={{ flex: 1, minHeight: 100 }}>
        <ZoomableImage src={PHOTO_SRC} alt="Photo de la pièce" />
      </Box>
      <Text c="dark.9" fw={600} size="sm" ta="center">
        indiquez toute déviation de l'inventaire!
      </Text>
      {PHOTO_ANSWERS.map((_, i) => {
        const solved = matched[i] !== null;
        return (
          <Group key={i} wrap="nowrap" align="flex-start" gap="xs">
            <TextInput
              flex={1}
              size="xs"
              value={values[i]}
              disabled={solved}
              error={wrong === i}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setValues((vs) => vs.map((x, b) => (b === i ? v : x)));
                if (wrong === i) setWrong(null);
              }}
              onKeyDown={(e) => e.key === 'Enter' && !solved && submit(i)}
            />
            <Button
              size="xs"
              color={solved ? 'green' : 'blue'}
              disabled={solved}
              onClick={() => submit(i)}
            >
              Répondre
            </Button>
          </Group>
        );
      })}
      {allSolved && (
        <Title order={3} c="dark.9" ta="center">
          {PHOTO_CLUE}
        </Title>
      )}
    </Stack>
  );
}
