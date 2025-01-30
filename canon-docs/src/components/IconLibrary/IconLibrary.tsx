/*
 * Copyright 2024 The Backstage Authors
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
'use client';

import { Text, Icon, icons } from '../../../../packages/canon';
import type { IconNames } from '../../../../packages/canon';
import styles from './styles.module.css';

export const IconLibrary = () => {
  const list = Object.keys(icons);

  return (
    <div className={styles.library}>
      {list.map(icon => (
        <div key={icon} className={styles.item}>
          <div className={styles.icon}>
            <Icon name={icon as IconNames} />
          </div>
          <Text variant="body">{icon}</Text>
        </div>
      ))}
    </div>
  );
};
