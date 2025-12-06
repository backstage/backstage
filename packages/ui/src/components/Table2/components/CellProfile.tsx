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
import { CellProfileProps } from '../types';
import { Text } from '../../Text/Text';
import { Link } from '../../Link/Link';
import { Avatar } from '../../Avatar';
import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import { Cell as ReactAriaCell } from 'react-aria-components';
import styles from '../Table.module.css';

/** @public */
export const CellProfile = (props: CellProfileProps) => {
  const { classNames, cleanedProps } = useStyles(TableDefinition, {
    color: 'primary' as const,
    ...props,
  });
  const { className, src, name, href, description, color, ...rest } =
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
        {src && name && (
          <Avatar src={src} name={name} size="x-small" purpose="decoration" />
        )}
        <div
          className={clsx(
            classNames.cellContent,
            styles[classNames.cellContent],
          )}
        >
          {name && href ? (
            <Link href={href}>{name}</Link>
          ) : (
            <Text as="p" variant="body-medium" color={color}>
              {name}
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
