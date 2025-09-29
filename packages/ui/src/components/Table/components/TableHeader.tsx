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

import {
  TableHeader as ReactAriaTableHeader,
  type TableHeaderProps,
  Checkbox,
} from 'react-aria-components';
import { Collection, useTableOptions } from 'react-aria-components';
import { Column } from './Column';
import { useStyles } from '../../../hooks/useStyles';

/** @public */
export const TableHeader = <T extends object>({
  columns,
  children,
}: TableHeaderProps<T>) => {
  let { selectionBehavior, selectionMode, allowsDragging } = useTableOptions();

  const { classNames } = useStyles('Table');

  return (
    <ReactAriaTableHeader className={classNames.header}>
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <Column />}
      {selectionBehavior === 'toggle' && (
        <Column>
          {selectionMode === 'multiple' && <Checkbox slot="selection" />}
        </Column>
      )}
      <Collection items={columns}>{children}</Collection>
    </ReactAriaTableHeader>
  );
};
