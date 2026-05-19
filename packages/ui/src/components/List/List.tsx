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
  GridList as RAGridList,
  GridListItem as RAGridListItem,
  Text,
} from 'react-aria-components';
import { RiCheckLine, RiMoreLine } from '@remixicon/react';
import { useDefinition } from '../../hooks/useDefinition';
import { ListDefinition, ListRowDefinition } from './definition';
import type { ListProps, ListRowProps } from './types';
import { Box } from '../Box/Box';
import { ButtonIcon } from '../ButtonIcon';
import { MenuTrigger, Menu } from '../Menu';

/**
 * A list displays a list of interactive rows with support for keyboard
 * navigation, single or multiple selection, and row actions.
 *
 * @public
 */
export const List = <T extends object>(props: ListProps<T>) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    ListDefinition,
    props,
  );
  const { classes, items, children, renderEmptyState } = ownProps;

  return (
    <RAGridList
      className={classes.root}
      items={items}
      renderEmptyState={renderEmptyState}
      {...dataAttributes}
      {...restProps}
    >
      {children}
    </RAGridList>
  );
};

/**
 * A row within a List.
 *
 * @public
 */
export const ListRow = (props: ListRowProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    ListRowDefinition,
    props,
  );
  const { classes, children, description, icon, menuItems, customActions } =
    ownProps;

  const textValue = typeof children === 'string' ? children : undefined;

  return (
    <RAGridListItem
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
            <span>{children}</span>
            {description && (
              <Text slot="description" className={classes.description}>
                {description}
              </Text>
            )}
          </div>
          {customActions && (
            <div className={classes.actions}>{customActions}</div>
          )}
          {menuItems && (
            <div className={classes.actions}>
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
    </RAGridListItem>
  );
};
