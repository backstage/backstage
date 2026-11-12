/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useEffect } from 'react';
import { Flex, Text } from '@backstage/ui';
import { getTimes, type ClockConfig } from './clocks';
import styles from './WorldClock.module.css';

export const WorldClock = (props: {
  clockConfigs?: ClockConfig[];
  customTimeFormat?: Intl.DateTimeFormatOptions;
}) => {
  const { clockConfigs, customTimeFormat } = props;
  const [clocks, setClocks] = useState(() =>
    getTimes(clockConfigs, customTimeFormat),
  );

  useEffect(() => {
    if (!clockConfigs?.length) {
      return undefined;
    }
    setClocks(getTimes(clockConfigs, customTimeFormat));
    const id = setInterval(() => {
      setClocks(getTimes(clockConfigs, customTimeFormat));
    }, 1000);
    return () => clearInterval(id);
  }, [clockConfigs, customTimeFormat]);

  if (!clockConfigs?.length) {
    return (
      <Text as="p" color="secondary">
        No clocks configured. Add clock configurations in your app-config.yaml
        to display world clocks.
      </Text>
    );
  }

  return (
    <Flex gap="8" className={styles.container}>
      {clocks.map(clock => (
        <div key={clock.label} aria-label={`${clock.label}: ${clock.value}`}>
          <Text as="p" weight="bold" color="primary" className={styles.label}>
            {clock.label}
          </Text>
          <Text as="p" color="secondary" className={styles.value}>
            <time dateTime={clock.dateTime}>{clock.value}</time>
          </Text>
        </div>
      ))}
    </Flex>
  );
};
