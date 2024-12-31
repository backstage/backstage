'use client';

import { Inline, Stack, Text } from '@backstage/canon';
import { screenSizes } from '@/utils/data';
import { Frame } from '@/components/Frame';
import { usePlayground } from '@/utils/playground-context';
import { ButtonPlayground } from './button';
import { CheckboxPlayground } from './checkbox';
import styles from './styles.module.css';
import { ReactNode } from 'react';

export default function PlaygroundPage() {
  const { selectedScreenSizes, selectedComponents } = usePlayground();

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
    <Stack gap="xl">
      {selectedComponents.find(c => c === 'button') && (
        <Line content={<ButtonPlayground />} title="Button" />
      )}
      {selectedComponents.find(c => c === 'checkbox') && (
        <Line content={<CheckboxPlayground />} title="Checkbox" />
      )}
    </Stack>
  );
};

const Line = ({ content, title }: { content: ReactNode; title: string }) => {
  return (
    <Inline gap={{ xs: 'xs', md: 'xl' }}>
      <div style={{ width: '100px' }}>
        <Text>{title}</Text>
      </div>
      {content}
    </Inline>
  );
};
