'use client';

import styles from './styles.module.css';
import { Text } from '@backstage/canon';
import { screenSizes } from '@/utils/data';
import { Frame } from '@/components/Frame';
import { Stack, Inline, Button } from '@backstage/canon';

export default function PlaygroundPage() {
  return (
    <div className={styles.container}>
      {screenSizes.map(screenSize => (
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
              <Stack>
                <Stack>
                  <Text>Button - Primary - Small</Text>
                  <Inline alignY="center">
                    <Button iconStart="cloud">Button</Button>
                    <Button iconEnd="chevronRight">Button</Button>
                    <Button iconStart="cloud" iconEnd="chevronRight">
                      Button
                    </Button>
                    <Button iconStart="cloud" iconEnd="chevronRight">
                      Button
                    </Button>
                    <Button iconStart="cloud" iconEnd="chevronRight">
                      Button
                    </Button>
                    <Button iconStart="cloud" iconEnd="chevronRight">
                      Button
                    </Button>
                  </Inline>
                </Stack>
              </Stack>
            </Frame>
          </div>
        </div>
      ))}
    </div>
  );
}
