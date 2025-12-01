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

import clsx from 'clsx';
import { Text } from '../../Text';
import { Link } from '../../Link';
import { Cell as ReactAriaCell } from 'react-aria-components';
import type { CellProps } from '../types';
import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import styles from '../Table.module.css';

/** @public */
const Cell = (props: CellProps) => {
  const { classNames, cleanedProps } = useStyles(TableDefinition, {
    color: 'primary' as const,
    ...props,
  });
  const { className, title, description, color, leadingIcon, href, ...rest } =
    cleanedProps;

  return (
    <ReactAriaCell
      className={clsx(classNames.cell, styles[classNames.cell], className)}
      {...rest}
    >
      <div
        className={clsx(
          classNames.cellContentWrapper,
          styles[classNames.cellContentWrapper],
        )}
      >
        {leadingIcon && (
          <div
            className={clsx(classNames.cellIcon, styles[classNames.cellIcon])}
          >
            {leadingIcon}
          </div>
        )}
        <div
          className={clsx(
            classNames.cellContent,
            styles[classNames.cellContent],
          )}
        >
          {href ? (
            <Link href={href} variant="body-medium" color={color}>
              {title}
            </Link>
          ) : (
            <Text as="p" variant="body-medium" color={color}>
              {title}
            </Text>
          )}
          {description && (
            <Text variant="body-medium" color="secondary">
              {description}
            </Text>
          )}
        </div>
      </div>
    </ReactAriaCell>
  );
};

Cell.displayName = 'Cell';

export { Cell };
