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

import { useCallback, useMemo } from 'react';
import { flexRender } from '@tanstack/react-table';
import { Icon } from '../../Icon';
import { Hidden } from '../../Hidden';
import { RawTableHeadProps } from './types';
import { useStyles } from '../../../hooks/useStyles';

function getSortTitle(nextOrder: string | false) {
  if (nextOrder === 'asc') {
    return 'Sort ascending';
  }
  if (nextOrder === 'desc') {
    return 'Sort descending';
  }
  return 'Clear sort';
}

/** @internal */
export function RawTableHead<TData>({ header }: RawTableHeadProps<TData>) {
  const { classNames } = useStyles('Table');
  const headerContent = useMemo(
    () => flexRender(header.column.columnDef.header, header.getContext()),
    [header],
  );

  const handleSort = useCallback(
    (e: React.MouseEvent | React.KeyboardEvent) => {
      if ('key' in e && e.key !== 'Enter' && e.key !== ' ') {
        return;
      }
      e.preventDefault();
      header.column.getToggleSortingHandler()?.(e);
    },
    [header],
  );

  if (!header.column.getCanSort()) {
    return <th className={classNames.head}>{headerContent}</th>;
  }

  return (
    <th className={classNames.head}>
      <span
        role="button"
        tabIndex={0}
        className={classNames.headSortButton}
        onClick={handleSort}
        onKeyDown={handleSort}
        {...(header.column.getIsSorted() && {
          'data-sort-order': header.column.getIsSorted(),
        })}
      >
        {headerContent}
        <Hidden>, {getSortTitle(header.column.getNextSortingOrder())}</Hidden>
        <Icon aria-hidden tab-index={-1} name="arrow-down" />
      </span>
    </th>
  );
}
