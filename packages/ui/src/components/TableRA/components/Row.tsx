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
  Cell,
  Collection,
  Checkbox,
} from 'react-aria-components';
import { useStyles } from '../../../hooks/useStyles';

export function Row<T extends object>({
  id,
  columns,
  children,
  ...otherProps
}: RowProps<T>) {
  const { classNames } = useStyles('TableRA');

  let { selectionBehavior } = useTableOptions();

  return (
    <ReactAriaRow id={id} className={classNames.row} {...otherProps}>
      {selectionBehavior === 'toggle' && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </ReactAriaRow>
  );
}
