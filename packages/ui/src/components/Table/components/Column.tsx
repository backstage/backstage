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
import { useDefinition } from '../../../hooks/useDefinition';
import { ColumnDefinition } from '../definition';
import { ColumnProps } from '../types';
import { RiArrowUpLine } from '@remixicon/react';

/** @public */
export const Column = (props: ColumnProps) => {
  const { ownProps, restProps } = useDefinition(ColumnDefinition, props);
  const { classes, children } = ownProps;

  return (
    <ReactAriaColumn className={classes.root} {...restProps}>
      {({ allowsSorting }) => (
        <div className={classes.headContent}>
          {children}
          {allowsSorting && (
            <span aria-hidden="true" className={classes.headSortButton}>
              <RiArrowUpLine size={16} />
            </span>
          )}
        </div>
      )}
    </ReactAriaColumn>
  );
};
