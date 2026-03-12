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
  Collection,
  useTableOptions,
} from 'react-aria-components';
import { Checkbox } from '../../Checkbox';
import { Column } from './Column';
import { useDefinition } from '../../../hooks/useDefinition';
import { TableHeaderDefinition } from '../definition';
import type { TableHeaderProps } from '../types';
import { Flex } from '../../Flex';

/** @public */
export const TableHeader = <T extends object>(props: TableHeaderProps<T>) => {
  let { selectionBehavior, selectionMode } = useTableOptions();

  const { ownProps, restProps } = useDefinition(TableHeaderDefinition, props);
  const { classes, columns, children } = ownProps;

  return (
    <ReactAriaTableHeader className={classes.root} {...restProps}>
      {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
        <Column
          width={40}
          minWidth={40}
          maxWidth={40}
          className={classes.headSelection}
        >
          <Flex justify="center" align="center">
            <Checkbox slot="selection">
              <></>
            </Checkbox>
          </Flex>
        </Column>
      )}
      <Collection items={columns}>{children}</Collection>
    </ReactAriaTableHeader>
  );
};
