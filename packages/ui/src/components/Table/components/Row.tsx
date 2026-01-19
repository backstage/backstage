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
  Row as ReactAriaRow,
  RowProps,
  useTableOptions,
  Cell as ReactAriaCell,
  Collection,
  RouterProvider,
} from 'react-aria-components';
import { Checkbox } from '../../Checkbox';
import { useStyles } from '../../../hooks/useStyles';
import { TableDefinition } from '../definition';
import { useNavigate } from 'react-router-dom';
import { useHref } from 'react-router-dom';
import { isExternalLink } from '../../../utils/isExternalLink';
import styles from '../Table.module.css';
import clsx from 'clsx';
import { Flex } from '../../Flex';

/** @public */
export function Row<T extends object>(props: RowProps<T>) {
  const { classNames, cleanedProps } = useStyles(TableDefinition, props);
  const { id, columns, children, href, ...rest } = cleanedProps;
  const navigate = useNavigate();
  const isExternal = isExternalLink(href);

  let { selectionBehavior, selectionMode } = useTableOptions();

  const content = (
    <>
      {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
        <ReactAriaCell
          className={clsx(
            classNames.cellSelection,
            styles[classNames.cell],
            styles[classNames.cellSelection],
          )}
        >
          <Flex justify="center" align="center">
            <Checkbox slot="selection">
              <></>
            </Checkbox>
          </Flex>
        </ReactAriaCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </>
  );

  if (!href || isExternal) {
    return (
      <ReactAriaRow
        id={id}
        href={href}
        className={clsx(classNames.row, styles[classNames.row])}
        {...rest}
      >
        {content}
      </ReactAriaRow>
    );
  }

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ReactAriaRow
        id={id}
        href={href}
        className={clsx(classNames.row, styles[classNames.row])}
        data-react-aria-pressable="true"
        {...rest}
      >
        {content}
      </ReactAriaRow>
    </RouterProvider>
  );
}
