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
  RouterProvider,
  Virtualizer,
  ListLayout,
} from 'react-aria-components';
import { useStyles } from '../../hooks/useStyles';
import { MenuDefinition } from './definition';
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
import { useNavigate, useHref } from 'react-router-dom';
import { isExternalLink } from '../../utils/isExternalLink';
import styles from './Menu.module.css';
import clsx from 'clsx';

// The height will be used for virtualized menus. It should match the size set in CSS for each menu item.
const rowHeight = 32;

const MenuEmptyState = () => {
  const { classNames } = useStyles(MenuDefinition);

  return (
    <div className={clsx(classNames.emptyState, styles[classNames.emptyState])}>
      No results found.
    </div>
  );
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
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const {
    className,
    placement = 'bottom start',
    virtualized = false,
    maxWidth,
    maxHeight,
    style,
    ...rest
  } = cleanedProps;

  const navigate = useNavigate();
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const menuContent = (
    <RAMenu
      className={clsx(classNames.content, styles[classNames.content])}
      renderEmptyState={() => <MenuEmptyState />}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...rest}
    />
  );

  return (
    <RAPopover
      className={clsx(
        classNames.popover,
        styles[classNames.popover],
        className,
      )}
      placement={placement}
    >
      <RouterProvider navigate={navigate} useHref={useHref}>
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
      </RouterProvider>
    </RAPopover>
  );
};

/** @public */
export const MenuListBox = (props: MenuListBoxProps<object>) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const {
    className,
    selectionMode = 'single',
    placement = 'bottom start',
    virtualized = false,
    maxWidth,
    maxHeight,
    style,
    ...rest
  } = cleanedProps;
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const listBoxContent = (
    <RAListBox
      className={clsx(classNames.content, styles[classNames.content])}
      selectionMode={selectionMode}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...rest}
    />
  );

  return (
    <RAPopover
      className={clsx(
        classNames.popover,
        styles[classNames.popover],
        className,
      )}
      placement={placement}
    >
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
    </RAPopover>
  );
};

/** @public */
export const MenuAutocomplete = (props: MenuAutocompleteProps<object>) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const {
    className,
    placement = 'bottom start',
    virtualized = false,
    maxWidth,
    maxHeight,
    style,
    ...rest
  } = cleanedProps;
  const { contains } = useFilter({ sensitivity: 'base' });
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');
  const navigate = useNavigate();

  const menuContent = (
    <RAMenu
      className={clsx(classNames.content, styles[classNames.content])}
      renderEmptyState={() => <MenuEmptyState />}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...rest}
    />
  );

  return (
    <RAPopover
      className={clsx(
        classNames.popover,
        styles[classNames.popover],
        className,
      )}
      placement={placement}
    >
      <RouterProvider navigate={navigate} useHref={useHref}>
        <RAAutocomplete filter={contains}>
          <RASearchField
            className={clsx(
              classNames.searchField,
              styles[classNames.searchField],
            )}
            aria-label={props.placeholder || 'Search'}
          >
            <RAInput
              className={clsx(
                classNames.searchFieldInput,
                styles[classNames.searchFieldInput],
              )}
              placeholder={props.placeholder || 'Search...'}
            />
            <RAButton
              className={clsx(
                classNames.searchFieldClear,
                styles[classNames.searchFieldClear],
              )}
            >
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
      </RouterProvider>
    </RAPopover>
  );
};

/** @public */
export const MenuAutocompleteListbox = (
  props: MenuAutocompleteListBoxProps<object>,
) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const {
    className,
    selectionMode = 'single',
    placement = 'bottom start',
    virtualized = false,
    maxWidth,
    maxHeight,
    style,
    ...rest
  } = cleanedProps;
  const { contains } = useFilter({ sensitivity: 'base' });
  let newMaxWidth = maxWidth || (virtualized ? '260px' : 'undefined');

  const listBoxContent = (
    <RAListBox
      className={clsx(classNames.content, styles[classNames.content])}
      renderEmptyState={() => <MenuEmptyState />}
      selectionMode={selectionMode}
      style={{ width: newMaxWidth, maxHeight, ...style }}
      {...rest}
    />
  );

  return (
    <RAPopover
      className={clsx(
        classNames.popover,
        styles[classNames.popover],
        className,
      )}
      placement={placement}
    >
      <RAAutocomplete filter={contains}>
        <RASearchField
          className={clsx(
            classNames.searchField,
            styles[classNames.searchField],
          )}
          aria-label={props.placeholder || 'Search'}
        >
          <RAInput
            className={clsx(
              classNames.searchFieldInput,
              styles[classNames.searchFieldInput],
            )}
            placeholder={props.placeholder || 'Search...'}
          />
          <RAButton
            className={clsx(
              classNames.searchFieldClear,
              styles[classNames.searchFieldClear],
            )}
          >
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
    </RAPopover>
  );
};

/** @public */
export const MenuItem = (props: MenuItemProps) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const {
    className,
    iconStart,
    color = 'primary',
    children,
    href,
    ...rest
  } = cleanedProps;

  const isLink = href !== undefined;
  const isExternal = isExternalLink(href);

  if (isLink && isExternal) {
    return (
      <RAMenuItem
        className={clsx(classNames.item, styles[classNames.item], className)}
        data-color={color}
        textValue={typeof children === 'string' ? children : undefined}
        onAction={() => window.open(href, '_blank', 'noopener,noreferrer')}
        {...rest}
      >
        <div
          className={clsx(
            classNames.itemWrapper,
            styles[classNames.itemWrapper],
          )}
        >
          <div
            className={clsx(
              classNames.itemContent,
              styles[classNames.itemContent],
            )}
          >
            {iconStart}
            {children}
          </div>
          <div
            className={clsx(classNames.itemArrow, styles[classNames.itemArrow])}
          >
            <RiArrowRightSLine />
          </div>
        </div>
      </RAMenuItem>
    );
  }

  return (
    <RAMenuItem
      className={clsx(classNames.item, styles[classNames.item], className)}
      data-color={color}
      href={href}
      textValue={typeof children === 'string' ? children : undefined}
      {...rest}
    >
      <div
        className={clsx(classNames.itemWrapper, styles[classNames.itemWrapper])}
      >
        <div
          className={clsx(
            classNames.itemContent,
            styles[classNames.itemContent],
          )}
        >
          {iconStart}
          {children}
        </div>
        <div
          className={clsx(classNames.itemArrow, styles[classNames.itemArrow])}
        >
          <RiArrowRightSLine />
        </div>
      </div>
    </RAMenuItem>
  );
};

/** @public */
export const MenuListBoxItem = (props: MenuListBoxItemProps) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const { children, className, ...rest } = cleanedProps;

  return (
    <RAListBoxItem
      textValue={
        typeof props.children === 'string' ? props.children : undefined
      }
      className={clsx(
        classNames.itemListBox,
        styles[classNames.itemListBox],
        className,
      )}
      {...rest}
    >
      <div
        className={clsx(classNames.itemWrapper, styles[classNames.itemWrapper])}
      >
        <div
          className={clsx(
            classNames.itemContent,
            styles[classNames.itemContent],
          )}
        >
          <div
            className={clsx(
              classNames.itemListBoxCheck,
              styles[classNames.itemListBoxCheck],
            )}
          >
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
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const { children, className, title, ...rest } = cleanedProps;

  return (
    <RAMenuSection
      className={clsx(
        classNames.section,
        styles[classNames.section],
        className,
      )}
      {...rest}
    >
      <RAMenuHeader
        className={clsx(
          classNames.sectionHeader,
          styles[classNames.sectionHeader],
        )}
      >
        {title}
      </RAMenuHeader>
      {children}
    </RAMenuSection>
  );
};

/** @public */
export const MenuSeparator = (props: MenuSeparatorProps) => {
  const { classNames, cleanedProps } = useStyles(MenuDefinition, props);
  const { className, ...rest } = cleanedProps;

  return (
    <RAMenuSeparator
      className={clsx(
        classNames.separator,
        styles[classNames.separator],
        className,
      )}
      {...rest}
    />
  );
};
