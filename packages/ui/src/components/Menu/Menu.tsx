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
  MenuTrigger as RAMenuTrigger,
  Popover as RAPopover,
  MenuItem as RAMenuItem,
  Menu as RAMenu,
  MenuSection as RAMenuSection,
  Header as RAMenuHeader,
  Separator as RAMenuSeparator,
  SubmenuTrigger as RAMenuSubmenuTrigger,
  Autocomplete as RAAutocomplete,
  SearchField as RASearchField,
  Input as RAInput,
  Button as RAButton,
  ListBox as RAListBox,
  ListBoxItem as RAListBoxItem,
  useFilter,
  Virtualizer,
  ListLayout,
} from 'react-aria-components';
import { useDefinition } from '../../hooks/useDefinition';
import {
  MenuDefinition,
  MenuListBoxDefinition,
  MenuAutocompleteDefinition,
  MenuAutocompleteListboxDefinition,
  MenuItemDefinition,
  MenuListBoxItemDefinition,
  MenuSectionDefinition,
  MenuSeparatorDefinition,
  MenuEmptyStateDefinition,
} from './definition';
import type {
  MenuTriggerProps,
  SubmenuTriggerProps,
  MenuProps,
  MenuAutocompleteProps,
  MenuItemProps,
  MenuSectionProps,
  MenuSeparatorProps,
  MenuListBoxProps,
  MenuListBoxItemProps,
  MenuAutocompleteListBoxProps,
} from './types';
import {
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseCircleLine,
} from '@remixicon/react';
import {
  isInternalLink,
  createRoutingRegistration,
} from '../InternalLinkProvider';
import { Box } from '../Box';
import { BgReset } from '../../hooks/useBg';

const { RoutingProvider, useRoutingRegistrationEffect } =
  createRoutingRegistration();

// The height will be used for virtualized menus. It should match the size set in CSS for each menu item.
const rowHeight = 32;

const MenuEmptyState = () => {
  const { ownProps } = useDefinition(MenuEmptyStateDefinition, {});

  return <div className={ownProps.classes.root}>No results found.</div>;
};

/** @public */
export const MenuTrigger = (props: MenuTriggerProps) => {
  return <RAMenuTrigger {...props} />;
};

/** @public */
export const SubmenuTrigger = (props: SubmenuTriggerProps) => {
  return <RAMenuSubmenuTrigger {...props} />;
};

/** @public */
export const Menu = (props: MenuProps<object>) => {
  const { ownProps, restProps } = useDefinition(MenuDefinition, props);
  const { classes, placement, virtualized, maxWidth, maxHeight, style } =
    ownProps;

  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const menuContent = (
    <RAMenu
      className={classes.content}
      renderEmptyState={() => <MenuEmptyState />}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...restProps}
    />
  );

  return (
    <RoutingProvider>
      <RAPopover className={classes.root} placement={placement}>
        <BgReset>
          <Box bg="neutral" className={classes.inner}>
            {virtualized ? (
              <Virtualizer
                layout={ListLayout}
                layoutOptions={{
                  rowHeight,
                }}
              >
                {menuContent}
              </Virtualizer>
            ) : (
              menuContent
            )}
          </Box>
        </BgReset>
      </RAPopover>
    </RoutingProvider>
  );
};

/** @public */
export const MenuListBox = (props: MenuListBoxProps<object>) => {
  const { ownProps, restProps } = useDefinition(MenuListBoxDefinition, props);
  const {
    classes,
    selectionMode,
    placement,
    virtualized,
    maxWidth,
    maxHeight,
    style,
  } = ownProps;
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const listBoxContent = (
    <RAListBox
      className={classes.content}
      selectionMode={selectionMode}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...restProps}
    />
  );

  return (
    <RAPopover className={classes.root} placement={placement}>
      <BgReset>
        <Box bg="neutral" className={classes.inner}>
          {virtualized ? (
            <Virtualizer
              layout={ListLayout}
              layoutOptions={{
                rowHeight,
              }}
            >
              {listBoxContent}
            </Virtualizer>
          ) : (
            listBoxContent
          )}
        </Box>
      </BgReset>
    </RAPopover>
  );
};

/** @public */
export const MenuAutocomplete = (props: MenuAutocompleteProps<object>) => {
  const { ownProps, restProps } = useDefinition(
    MenuAutocompleteDefinition,
    props,
  );
  const {
    classes,
    placement,
    virtualized,
    maxWidth,
    maxHeight,
    style,
    placeholder,
  } = ownProps;
  const { contains } = useFilter({ sensitivity: 'base' });
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const menuContent = (
    <RAMenu
      className={classes.content}
      renderEmptyState={() => <MenuEmptyState />}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...restProps}
    />
  );

  return (
    <RoutingProvider>
      <RAPopover className={classes.root} placement={placement}>
        <BgReset>
          <Box bg="neutral" className={classes.inner}>
            <RAAutocomplete filter={contains}>
              <RASearchField
                className={classes.searchField}
                aria-label={placeholder || 'Search'}
              >
                <RAInput
                  className={classes.searchFieldInput}
                  placeholder={placeholder || 'Search...'}
                />
                <RAButton className={classes.searchFieldClear}>
                  <RiCloseCircleLine />
                </RAButton>
              </RASearchField>
              {virtualized ? (
                <Virtualizer
                  layout={ListLayout}
                  layoutOptions={{
                    rowHeight,
                  }}
                >
                  {menuContent}
                </Virtualizer>
              ) : (
                menuContent
              )}
            </RAAutocomplete>
          </Box>
        </BgReset>
      </RAPopover>
    </RoutingProvider>
  );
};

/** @public */
export const MenuAutocompleteListbox = (
  props: MenuAutocompleteListBoxProps<object>,
) => {
  const { ownProps, restProps } = useDefinition(
    MenuAutocompleteListboxDefinition,
    props,
  );
  const {
    classes,
    selectionMode,
    placement,
    virtualized,
    maxWidth,
    maxHeight,
    style,
    placeholder,
  } = ownProps;
  const { contains } = useFilter({ sensitivity: 'base' });
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const listBoxContent = (
    <RAListBox
      className={classes.content}
      renderEmptyState={() => <MenuEmptyState />}
      selectionMode={selectionMode}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...restProps}
    />
  );

  return (
    <RAPopover className={classes.root} placement={placement}>
      <BgReset>
        <Box bg="neutral" className={classes.inner}>
          <RAAutocomplete filter={contains}>
            <RASearchField
              className={classes.searchField}
              aria-label={placeholder || 'Search'}
            >
              <RAInput
                className={classes.searchFieldInput}
                placeholder={placeholder || 'Search...'}
              />
              <RAButton className={classes.searchFieldClear}>
                <RiCloseCircleLine />
              </RAButton>
            </RASearchField>
            {virtualized ? (
              <Virtualizer
                layout={ListLayout}
                layoutOptions={{
                  rowHeight,
                }}
              >
                {listBoxContent}
              </Virtualizer>
            ) : (
              listBoxContent
            )}
          </RAAutocomplete>
        </Box>
      </BgReset>
    </RAPopover>
  );
};

/** @public */
export const MenuItem = (props: MenuItemProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    MenuItemDefinition,
    props,
  );
  const { classes, iconStart, children, href } = ownProps;

  useRoutingRegistrationEffect(href);

  // External links open in new tab via window.open instead of client-side routing
  if (href && !isInternalLink(href)) {
    return (
      <RAMenuItem
        className={classes.root}
        {...dataAttributes}
        textValue={typeof children === 'string' ? children : undefined}
        onAction={() => window.open(href, '_blank', 'noopener,noreferrer')}
        {...restProps}
      >
        <div className={classes.itemWrapper}>
          <div className={classes.itemContent}>
            {iconStart}
            {children}
          </div>
          <div className={classes.itemArrow}>
            <RiArrowRightSLine />
          </div>
        </div>
      </RAMenuItem>
    );
  }

  return (
    <RAMenuItem
      className={classes.root}
      {...dataAttributes}
      href={href}
      textValue={typeof children === 'string' ? children : undefined}
      {...restProps}
    >
      <div className={classes.itemWrapper}>
        <div className={classes.itemContent}>
          {iconStart}
          {children}
        </div>
        <div className={classes.itemArrow}>
          <RiArrowRightSLine />
        </div>
      </div>
    </RAMenuItem>
  );
};

/** @public */
export const MenuListBoxItem = (props: MenuListBoxItemProps) => {
  const { ownProps, restProps } = useDefinition(
    MenuListBoxItemDefinition,
    props,
  );
  const { classes, children } = ownProps;

  return (
    <RAListBoxItem
      textValue={typeof children === 'string' ? children : undefined}
      className={classes.root}
      {...restProps}
    >
      <div className={classes.itemWrapper}>
        <div className={classes.itemContent}>
          <div className={classes.check}>
            <RiCheckLine />
          </div>
          {children}
        </div>
      </div>
    </RAListBoxItem>
  );
};

/** @public */
export const MenuSection = (props: MenuSectionProps<object>) => {
  const { ownProps, restProps } = useDefinition(MenuSectionDefinition, props);
  const { classes, children, title } = ownProps;

  return (
    <RAMenuSection className={classes.root} {...restProps}>
      <RAMenuHeader className={classes.header}>{title}</RAMenuHeader>
      {children}
    </RAMenuSection>
  );
};

/** @public */
export const MenuSeparator = (props: MenuSeparatorProps) => {
  const { ownProps, restProps } = useDefinition(MenuSeparatorDefinition, props);

  return <RAMenuSeparator className={ownProps.classes.root} {...restProps} />;
};
