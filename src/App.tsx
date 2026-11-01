import { Flex } from '@mantine/core';
import { CodePanel } from './components/CodePanel';
import { Section } from './components/Section';
import { Temporisation } from './components/Temporisation';

export function App() {
  return (
    <Flex p="md" gap="md" justify="space-between" align="flex-start">
      <Section>
        <Temporisation />
      </Section>
      <Section>
        <CodePanel />
      </Section>
    </Flex>
  );
}
