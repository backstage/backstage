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

/**
 * Renders a menu with an ellipse-button that contains the middle Breadcrumb items to be collapsed
 * @private
 */
export function CollapsedBreadcrumb(props: {
  items: Array<{ href?: string; label: React.ReactNode }>;
  ellipsisClassName: string;
  triggerClassName: string;
  separatorClassName: string;
  buttonAriaLabel?: string;
}) {
  const {
    items,
    ellipsisClassName,
    triggerClassName,
    separatorClassName,
    buttonAriaLabel = 'Show more breadcrumbs',
  } = props;

  return (
    <RACBreadcrumb className={ellipsisClassName}>
      <MenuTrigger>
        {/* Plain button instead of ButtonIcon to avoid padding that shifts the breadcrumb baseline */}
        <RACButton className={triggerClassName} aria-label={buttonAriaLabel}>
          …
        </RACButton>
        <Menu>
          {items.map((item, i) => (
            <MenuItem key={i} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
      <RiArrowRightSLine className={separatorClassName} aria-hidden="true" />
    </RACBreadcrumb>
  );
}
