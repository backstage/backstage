'use client';

import { ReactNode } from 'react';
import { Grid, Flex, Text } from '../../../../../packages/canon';
import { screenSizes } from '@/utils/data';
import { Frame } from '@/components/Frame';
import { usePlayground } from '@/utils/playground-context';
import { ButtonPlayground } from '@/snippets/button';
import { CheckboxPlayground } from '@/snippets/checkbox';
import { HeadingPlayground } from '@/snippets/heading';
import { TextPlayground } from '@/snippets/text';

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
        <Line content={<ButtonPlayground />} title="Button" />
      )}
      {selectedComponents.find(c => c === 'checkbox') && (
        <Line content={<CheckboxPlayground />} title="Checkbox" />
      )}
      {selectedComponents.find(c => c === 'heading') && (
        <Line content={<HeadingPlayground />} title="Heading" />
      )}
      {selectedComponents.find(c => c === 'text') && (
        <Line content={<TextPlayground />} title="Text" />
      )}
      {/* {selectedComponents.find(c => c === 'input') && (
        <Line content={<InputPlayground />} title="Input" />
      )} */}
    </Flex>
  );
};

const Line = ({ content, title }: { content: ReactNode; title: string }) => {
  return (
    <Grid gap={{ xs: '2', md: '4' }}>
      <Grid.Item colSpan="2">
        <Text>{title}</Text>
      </Grid.Item>
      <Grid.Item colSpan="10">{content}</Grid.Item>
    </Grid>
  );
};
