/*
 * Copyright 2025 The Backstage Authors
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

import { Column as ReactAriaColumn } from 'react-aria-components';
import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import styles from '../Table.module.css';
import clsx from 'clsx';
import { ColumnProps } from '../types';
import { RiArrowUpLine } from '@remixicon/react';

/** @public */
export const Column = (props: ColumnProps) => {
  const { classNames, cleanedProps } = useStyles(TableDefinition, props);
  const { className, children, ...rest } = cleanedProps;

  return (
    <ReactAriaColumn
      className={clsx(classNames.head, styles[classNames.head], className)}
      {...rest}
    >
      {({ allowsSorting }) => (
        <div
          className={clsx(
            classNames.headContent,
            styles[classNames.headContent],
          )}
        >
          {children}
          {allowsSorting && (
            <span
              aria-hidden="true"
              className={clsx(
                classNames.headSortButton,
                styles[classNames.headSortButton],
              )}
            >
              <RiArrowUpLine size={16} />
            </span>
          )}
        </div>
      )}
    </ReactAriaColumn>
  );
};
