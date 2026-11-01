import { Button, Center, Group, PinInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconVolume, IconVolumeOff } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { ANSWERS, AUDIO_URL, FINAL_CODE, UNLOCK_CODE, normalize } from '../game/codeConfig';

export function CodePanel() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [pin, setPin] = useState('');
  const [values, setValues] = useState<string[]>(ANSWERS.map(() => ''));
  const [solved, setSolved] = useState<boolean[]>(ANSWERS.map(() => false));
  const [wrong, setWrong] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(
    () => () => {
      audio.current?.pause();
    },
    [],
  );

  const onPinComplete = (value: string) => {
    if (value === UNLOCK_CODE) {
      const a = new Audio(AUDIO_URL);
      a.loop = true;
      audio.current = a;
      a.play().then(
        () => setPlaying(true),
        (err) => console.warn('Audio could not play:', err),
      );
      setUnlocked(true);
    } else {
      setPinError(true);
      window.setTimeout(() => {
        setPin('');
        setPinError(false);
      }, 600);
    }
  };

  const submit = (i: number) => {
    if (normalize(values[i]) === normalize(ANSWERS[i])) {
      setSolved((s) => s.map((v, j) => (j === i ? true : v)));
      setWrong(null);
    } else {
      setWrong(i);
    }
  };

  const allSolved = solved.every(Boolean);

  useEffect(() => {
    if (!allSolved || !audio.current) return;
    audio.current.pause();
    audio.current.currentTime = 0;
    setPlaying(false);
  }, [allSolved]);

  return (
    <Stack h="100%" p="xl" align="center">
      <Title order={1} c="dark.9" style={{ letterSpacing: '0.25em' }}>
        BELLO PODCAST
      </Title>
      <Center flex={1} w="100%">
        {!unlocked ? (
          <PinInput
            length={3}
            type="number"
            size="xl"
            mask
            value={pin}
            onChange={(v) => {
              setPin(v);
              setPinError(false);
            }}
            onComplete={onPinComplete}
            error={pinError}
            aria-label="Code"
          />
        ) : (
          <Stack w="100%" gap="md">
            <Center>
              {playing ? (
                <IconVolume size={48} color="var(--mantine-color-dark-9)" />
              ) : (
                <IconVolumeOff size={48} color="var(--mantine-color-dark-9)" />
              )}
            </Center>
            {ANSWERS.map((_, i) => (
              <Group key={i} wrap="nowrap" align="flex-end">
                <TextInput
                  flex={1}
                  label={i + 1}
                  styles={{ label: { color: 'var(--mantine-color-dark-9)', fontWeight: 700 } }}
                  value={values[i]}
                  disabled={solved[i]}
                  error={wrong === i}
                  onChange={(e) => {
                    const v = e.currentTarget.value;
                    setValues((vs) => vs.map((x, j) => (j === i ? v : x)));
                    if (wrong === i) setWrong(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && !solved[i] && submit(i)}
                />
                <Button
                  color={solved[i] ? 'green' : 'blue'}
                  variant="filled"
                  disabled={solved[i]}
                  onClick={() => submit(i)}
                >
                  Répondre
                </Button>
              </Group>
            ))}
            {allSolved && (
              <Stack align="center" gap={0} mt="md">
                <Text c="dark.9" size="sm">
                  Code final
                </Text>
                <Title order={1} c="dark.9" style={{ letterSpacing: '0.4em' }}>
                  {FINAL_CODE}
                </Title>
              </Stack>
            )}
          </Stack>
        )}
      </Center>
    </Stack>
  );
}


