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
  ListBox as RAListBox,
  ListBoxItem as RAListBoxItem,
  Text,
} from 'react-aria-components';
import { RiCheckLine, RiMoreLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { ListBoxDefinition, ListBoxItemDefinition } from './definition';
import type { ListBoxProps, ListBoxItemProps } from './types';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon';
import { MenuTrigger, Menu } from '../Menu';

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 *
 * @public
 */
export const ListBox = <T extends object>(props: ListBoxProps<T>) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    ListBoxDefinition,
    props,
  );
  const { classes, items, children, renderEmptyState } = ownProps;

  return (
    <RAListBox
      className={classes.root}
      items={items}
      renderEmptyState={renderEmptyState}
      {...dataAttributes}
      {...restProps}
    >
      {children}
    </RAListBox>
  );
};

/**
 * An item within a ListBox.
 *
 * @public
 */
export const ListBoxItem = (props: ListBoxItemProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    ListBoxItemDefinition,
    props,
  );
  const { classes, children, description, icon, menuItems, customActions } =
    ownProps;

  const textValue = typeof children === 'string' ? children : undefined;

  return (
    <RAListBoxItem
      textValue={textValue}
      className={classes.root}
      {...dataAttributes}
      {...restProps}
    >
      {({ isSelected }) => (
        <>
          {isSelected && (
            <div className={classes.check}>
              <RiCheckLine />
            </div>
          )}
          {icon && (
            <Box bg="neutral" className={classes.icon}>
              {icon}
            </Box>
          )}
          <div className={classes.label}>
            <Text slot="label">{children}</Text>
            {description && (
              <Text slot="description" className={classes.description}>
                {description}
              </Text>
            )}
          </div>
          {customActions && (
            <div
              className={classes.actions}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => e.stopPropagation()}
            >
              {customActions}
            </div>
          )}
          {menuItems && (
            <div
              className={classes.actions}
              onClick={e => e.stopPropagation()}
              onKeyDown={e => e.stopPropagation()}
            >
              <MenuTrigger>
                <ButtonIcon
                  icon={<RiMoreLine />}
                  size="small"
                  aria-label="More actions"
                  variant="tertiary"
                />
                <Menu placement="bottom end">{menuItems}</Menu>
              </MenuTrigger>
            </div>
          )}
        </>
      )}
    </RAListBoxItem>
  );
};
