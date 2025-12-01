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
  TableBody as ReactAriaTableBody,
  type TableBodyProps,
} from 'react-aria-components';
import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import styles from '../Table.module.css';
import clsx from 'clsx';

/** @public */
export const TableBody = <T extends object>(props: TableBodyProps<T>) => {
  const { classNames, cleanedProps } = useStyles(TableDefinition, props);

  return (
    <ReactAriaTableBody
      className={clsx(classNames.body, styles[classNames.body])}
      {...cleanedProps}
    />
  );
};
