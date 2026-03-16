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
import { isExternalLink } from '../../../utils/linkUtils';
import clsx from 'clsx';
import { Flex } from '../../Flex';

/** @public */
export function Row<T extends object>(props: RowProps<T>) {
  const { ownProps, restProps, analytics } = useDefinition(
    RowDefinition,
    props,
  );
  const { classes, columns, children, href } = ownProps;
  const isExternal = isExternalLink(href);
  const hasInternalHref = !!href && !isExternal;
  const hasExternalHref = !!href && isExternal;
  const hasInteraction = !!restProps.onAction || !!href;

  // Derive the effective target, defaulting to _blank for external links.
  const effectiveTarget = hasExternalHref ? '_blank' : restProps.target;
  // Always include noopener noreferrer when target=_blank, merging any
  // consumer-provided rel tokens to avoid reverse-tabnabbing risk.
  const effectiveRel =
    effectiveTarget === '_blank'
      ? [
          ...new Set([
            'noopener',
            'noreferrer',
            ...(restProps.rel?.split(/\s+/).filter(Boolean) ?? []),
          ]),
        ].join(' ')
      : restProps.rel;

  const handlePress = hasInteraction
    ? () => {
        restProps.onAction?.();
        if (href) {
          analytics.captureEvent('click', href, {
            attributes: { to: String(href) },
          });
        }
      }
    : undefined;

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
    <ReactAriaRow
      href={href}
      {...restProps}
      target={effectiveTarget}
      rel={effectiveRel}
      className={clsx(classes.root, restProps.className)}
      data-react-aria-pressable={hasInternalHref ? 'true' : undefined}
      onAction={handlePress}
    >
      {content}
    </ReactAriaRow>
  );
}
