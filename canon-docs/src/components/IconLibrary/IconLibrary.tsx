'use client';

import { Text, Icon, icons } from '@backstage/canon';
import type { IconNames } from '@backstage/canon';
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
