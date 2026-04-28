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

import type { HeaderMetadataStatusProps } from './types';
import { Text } from '../Text';
import { Link } from '../Link';
import styles from './HeaderMetadataStatus.module.css';

/**
 * Displays a single status indicator as a coloured dot with a label inside a
 * Header metadata value. Optionally renders the label as a link when href is provided.
 *
 * @public
 */
export const HeaderMetadataStatus = ({
  label,
  color,
  href,
}: HeaderMetadataStatusProps) => {
  return (
    <div className={styles.single}>
      <span
        aria-hidden="true"
        className={`${styles.dot} ${styles[`dot-${color}`]}`}
      />
      <Text variant="body-medium">
        {href ? (
          <Link href={href} standalone>
            {label}
          </Link>
        ) : (
          label
        )}
      </Text>
    </div>
  );
};
