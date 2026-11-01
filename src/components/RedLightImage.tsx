import { Center, Image, Text } from '@mantine/core';
import { useState } from 'react';

/** Output of tools/redlight.html: save its "Download PNG" as public/redlight.png. */
const SRC = `${import.meta.env.BASE_URL}redlight.png`;

export function RedLightImage() {
  const [failed, setFailed] = useState(false);

  return (
    <Center h="100%" p="md">
      {failed ? (
        <Text c="dark.9" size="sm">
          Image à venir
        </Text>
      ) : (
        <Image
          src={SRC}
          alt=""
          fit="contain"
          h="100%"
          w="100%"
          onError={() => setFailed(true)}
          style={{ imageRendering: 'pixelated' }}
        />
      )}
    </Center>
  );
}
