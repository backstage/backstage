/*
 * Copyright 2026 The Backstage Authors
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
  Breadcrumb as RACBreadcrumb,
  Button as RACButton,
} from 'react-aria-components';
import { RiArrowRightSLine } from '@remixicon/react';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import { Text } from '../Text';
import { useBreadcrumbsStyle } from './BreadcrumbsContext';
import type { BreadcrumbStyleProps } from './types';

/**
 * Renders a menu with an ellipse-button that contains the middle Breadcrumb items to be collapsed
 * @private
 */
export function CollapsedBreadcrumb(
  props: {
    items: Array<{ href?: string; label: React.ReactNode }>;
    ellipsisClassName: string;
    triggerClassName: string;
    separatorClassName: string;
    buttonAriaLabel?: string;
  } & BreadcrumbStyleProps,
) {
  const {
    items,
    ellipsisClassName,
    triggerClassName,
    separatorClassName,
    buttonAriaLabel = 'Show more breadcrumbs',
    variant: variantOverride,
    color: colorOverride,
    weight: weightOverride,
  } = props;
  const defaults = useBreadcrumbsStyle();
  const variant = variantOverride ?? defaults.variant;
  const color = colorOverride ?? defaults.color;
  const weight = weightOverride ?? defaults.weight;
  const separatorColor = `var(--bui-fg-${defaults.color ?? 'primary'})`;
  const separator = defaults.separator ?? (
    <RiArrowRightSLine color={separatorColor} />
  );

  return (
    <RACBreadcrumb className={ellipsisClassName} data-variant={variant}>
      <MenuTrigger>
        {/* Plain button instead of ButtonIcon to avoid padding that shifts the breadcrumb baseline */}
        <RACButton className={triggerClassName} aria-label={buttonAriaLabel}>
          <Text as="span" variant={variant} color={color} weight={weight}>
            …
          </Text>
        </RACButton>
        <Menu>
          {items.map((item, i) => (
            <MenuItem key={i} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
      <span aria-hidden="true" className={separatorClassName}>
        {separator}
      </span>
    </RACBreadcrumb>
  );
}
