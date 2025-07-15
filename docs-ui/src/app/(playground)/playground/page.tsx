'use client';

import { ReactNode } from 'react';
import { Grid, Flex, Text } from '../../../../../packages/ui';
import { screenSizes } from '@/utils/data';
import { Frame } from '@/components/Frame';
import { usePlayground } from '@/utils/playground-context';
import {
  ButtonSnippet,
  CheckboxSnippet,
  HeadingSnippet,
  TextSnippet,
} from '@/snippets/stories-snippets';

import styles from './styles.module.css';

export default function PlaygroundPage() {
  const { selectedScreenSizes } = usePlayground();

  const filteredScreenSizes = screenSizes.filter(item =>
    selectedScreenSizes.includes(item.slug),
  );

  if (filteredScreenSizes.length === 0) {
    return (
      <div className={styles.containerEmpty}>
        <Content />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {filteredScreenSizes.map(screenSize => (
        <div
          className={styles.breakpointContainer}
          style={{ width: screenSize.width }}
          key={screenSize.slug}
        >
          <Text>
            {screenSize.title} - {screenSize.width}px
          </Text>
          <div className={styles.breakpointContent}>
            <Frame>
              <Content />
            </Frame>
          </div>
        </div>
      ))}
    </div>
  );
}

const Content = () => {
  const { selectedComponents } = usePlayground();

  return (
    <Flex direction="column" gap="4">
      {selectedComponents.find(c => c === 'button') && (
        <Line content={<ButtonSnippet story="Playground" />} title="Button" />
      )}
      {selectedComponents.find(c => c === 'checkbox') && (
        <Line
          content={<CheckboxSnippet story="Playground" />}
          title="Checkbox"
        />
      )}
      {selectedComponents.find(c => c === 'heading') && (
        <Line content={<HeadingSnippet story="Playground" />} title="Heading" />
      )}
      {selectedComponents.find(c => c === 'text') && (
        <Line content={<TextSnippet story="Playground" />} title="Text" />
      )}
    </Flex>
  );
};

const Line = ({ content, title }: { content: ReactNode; title: string }) => {
  return (
    <Grid.Root gap={{ xs: '2', md: '4' }}>
      <Grid.Item colSpan="2">
        <Text>{title}</Text>
      </Grid.Item>
      <Grid.Item colSpan="10">{content}</Grid.Item>
    </Grid.Root>
  );
};
