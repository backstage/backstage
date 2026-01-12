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

import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import { Table as ReactAriaTable } from 'react-aria-components';
import styles from '../Table.module.css';
import clsx from 'clsx';
import { TableRootProps } from '../types';

/** @public */
export const TableRoot = (props: TableRootProps) => {
  const { classNames, dataAttributes, cleanedProps } = useStyles(
    TableDefinition,
    props,
  );

  return (
    <ReactAriaTable
      className={clsx(classNames.table, styles[classNames.table])}
      aria-label="Data table"
      aria-busy={props.stale}
      {...dataAttributes}
      {...cleanedProps}
    />
  );
};
