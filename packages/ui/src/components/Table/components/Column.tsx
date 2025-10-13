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
import { Icon } from '../../Icon';
import { useStyles } from '../../../hooks/useStyles';
import styles from '../Table.module.css';
import clsx from 'clsx';
import { ColumnProps } from '../types';

/** @public */
export const Column = (props: ColumnProps) => {
  const { classNames, cleanedProps } = useStyles<'Table', ColumnProps>(
    'Table',
    props,
  );
  const { children, ...rest } = cleanedProps;

  return (
    <ReactAriaColumn
      className={clsx(classNames.head, styles[classNames.head])}
      {...rest}
    >
      {({ allowsSorting, sortDirection }) => (
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
              {sortDirection === 'ascending' ? (
                <Icon name="arrow-up" size={16} />
              ) : (
                <Icon name="arrow-down" size={16} />
              )}
            </span>
          )}
        </div>
      )}
    </ReactAriaColumn>
  );
};
