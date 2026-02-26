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
  useTableOptions,
  Cell as ReactAriaCell,
  Collection,
} from 'react-aria-components';
import { Checkbox } from '../../Checkbox';
import { useDefinition } from '../../../hooks/useDefinition';
import { RowDefinition } from '../definition';
import type { RowProps } from '../types';
import { isExternalLink } from '../../../utils/isExternalLink';
import { InternalLinkProvider } from '../../InternalLinkProvider';
import clsx from 'clsx';
import { Flex } from '../../Flex';

/** @public */
export function Row<T extends object>(props: RowProps<T>) {
  const { ownProps, restProps } = useDefinition(RowDefinition, props);
  const { classes, columns, children, href } = ownProps;
  const hasInternalHref = !!href && !isExternalLink(href);

  let { selectionBehavior, selectionMode } = useTableOptions();

  const content = (
    <>
      {selectionBehavior === 'toggle' && selectionMode === 'multiple' && (
        <ReactAriaCell className={clsx(classes.cell, classes.cellSelection)}>
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

  return (
    <InternalLinkProvider href={href}>
      <ReactAriaRow
        href={href}
        className={classes.root}
        data-react-aria-pressable={hasInternalHref ? 'true' : undefined}
        {...restProps}
      >
        {content}
      </ReactAriaRow>
    </InternalLinkProvider>
  );
}
