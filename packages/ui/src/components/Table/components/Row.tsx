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
  RouterProvider,
} from 'react-aria-components';
import { useStyles } from '../../../hooks/useStyles';
import { useNavigate } from 'react-router-dom';
import { useHref } from 'react-router-dom';
import { isExternalLink } from '../../../utils/isExternalLink';

/** @public */
export function Row<T extends object>({
  id,
  columns,
  children,
  href,
  ...otherProps
}: RowProps<T>) {
  const { classNames } = useStyles('Table');
  const navigate = useNavigate();
  const isExternal = isExternalLink(href);

  let { selectionBehavior } = useTableOptions();

  const content = (
    <>
      {selectionBehavior === 'toggle' && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </>
  );

  if (isExternal) {
    return (
      <ReactAriaRow id={id} className={classNames.row} {...otherProps}>
        {content}
      </ReactAriaRow>
    );
  }

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <ReactAriaRow
        id={id}
        className={classNames.row}
        data-react-aria-pressable="true"
        {...otherProps}
      >
        {content}
      </ReactAriaRow>
    </RouterProvider>
  );
}
