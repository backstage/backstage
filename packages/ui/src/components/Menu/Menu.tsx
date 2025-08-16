/*
 * Copyright 2024 The Backstage Authors
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
} from 'react-aria-components';
import { ScrollArea } from '../ScrollArea';
import { useStyles } from '../../hooks/useStyles';
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
import { isExternalLink } from '../../utils/isExternalLink';
import { useNavigate, useHref } from 'react-router-dom';

const MenuEmptyState = () => {
  const { classNames } = useStyles('Menu');

  return <div className={classNames.emptyState}>No results found.</div>;
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
  const { placement = 'bottom start', ...rest } = props;
  const { classNames } = useStyles('Menu');

  return (
    <RAPopover className={classNames.popover} placement={placement}>
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <RAMenu className={classNames.content} {...rest}>
            {props.children}
          </RAMenu>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" style={{}}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </RAPopover>
  );
};

/** @public */
export const MenuListBox = (props: MenuListBoxProps<object>) => {
  const {
    selectionMode = 'single',
    placement = 'bottom start',
    ...rest
  } = props;
  const { classNames } = useStyles('Menu');

  return (
    <RAPopover className={classNames.popover} placement={placement}>
      <ScrollArea.Root>
        <ScrollArea.Viewport>
          <RAListBox
            className={classNames.content}
            selectionMode={selectionMode}
            {...rest}
          />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" style={{}}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </RAPopover>
  );
};

/** @public */
export const MenuAutocomplete = (props: MenuAutocompleteProps<object>) => {
  const { placement = 'bottom start', ...rest } = props;
  const { classNames } = useStyles('Menu');
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <RAPopover className={classNames.popover} placement={placement}>
      <RAAutocomplete filter={contains}>
        <RASearchField className={classNames.searchField}>
          <RAInput
            className={classNames.searchFieldInput}
            aria-label="Search"
            placeholder={props.placeholder || 'Search...'}
          />
          <RAButton className={classNames.searchFieldClear}>
            <RiCloseCircleLine />
          </RAButton>
        </RASearchField>
        <ScrollArea.Root>
          <ScrollArea.Viewport>
            <RAMenu
              className={classNames.content}
              renderEmptyState={() => <MenuEmptyState />}
              {...rest}
            />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" style={{}}>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </RAAutocomplete>
    </RAPopover>
  );
};

/** @public */
export const MenuAutocompleteListbox = (
  props: MenuAutocompleteListBoxProps<object>,
) => {
  const {
    selectionMode = 'single',
    placement = 'bottom start',
    ...rest
  } = props;
  const { classNames } = useStyles('Menu');
  const { contains } = useFilter({ sensitivity: 'base' });

  return (
    <RAPopover className={classNames.popover} placement={placement}>
      <RAAutocomplete filter={contains}>
        <RASearchField className={classNames.searchField}>
          <RAInput
            className={classNames.searchFieldInput}
            aria-label="Search"
            placeholder={props.placeholder || 'Search...'}
          />
          <RAButton className={classNames.searchFieldClear}>
            <RiCloseCircleLine />
          </RAButton>
        </RASearchField>
        <ScrollArea.Root>
          <ScrollArea.Viewport>
            <RAListBox
              className={classNames.content}
              renderEmptyState={() => <MenuEmptyState />}
              selectionMode={selectionMode}
              {...rest}
            />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" style={{}}>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </RAAutocomplete>
    </RAPopover>
  );
};

/** @public */
export const MenuItem = (props: MenuItemProps) => {
  const { iconStart, color = 'primary', children, href, ...rest } = props;
  const { classNames } = useStyles('Menu');
  const navigate = useNavigate();

  const isLink = href !== undefined;
  const isExternal = isExternalLink(href);

  const content = (
    <RAMenuItem
      className={classNames.item}
      data-color={color}
      href={href}
      textValue={typeof children === 'string' ? children : undefined}
      {...rest}
    >
      <div className={classNames.itemContent}>
        {iconStart}
        {children}
      </div>
      <div className={classNames.itemArrow}>
        <RiArrowRightSLine />
      </div>
    </RAMenuItem>
  );

  if (isLink && !isExternal) {
    return (
      <RouterProvider navigate={navigate} useHref={useHref}>
        {content}
      </RouterProvider>
    );
  }

  return content;
};

/** @public */
export const MenuListBoxItem = (props: MenuListBoxItemProps) => {
  const { children, ...rest } = props;
  const { classNames } = useStyles('Menu');

  return (
    <RAListBoxItem
      textValue={
        typeof props.children === 'string' ? props.children : undefined
      }
      className={classNames.itemListBox}
      {...rest}
    >
      <div className={classNames.itemContent}>
        <div className={classNames.itemListBoxCheck}>
          <RiCheckLine />
        </div>
        {children}
      </div>
    </RAListBoxItem>
  );
};

/** @public */
export const MenuSection = (props: MenuSectionProps<object>) => {
  const { classNames } = useStyles('Menu');

  return (
    <RAMenuSection className={classNames.section} {...props}>
      <RAMenuHeader className={classNames.sectionHeader}>
        {props.title}
      </RAMenuHeader>
      {props.children}
    </RAMenuSection>
  );
};

/** @public */
export const MenuSeparator = (props: MenuSeparatorProps) => {
  const { classNames } = useStyles('Menu');

  return <RAMenuSeparator className={classNames.separator} {...props} />;
};
