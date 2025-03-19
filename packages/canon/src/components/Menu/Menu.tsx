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

import React from 'react';
import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';
import clsx from 'clsx';
import { MenuComponent } from './types';

const MenuTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Trigger
    ref={ref}
    className={clsx('canon-MenuTrigger', className)}
    {...props}
  />
));
MenuTrigger.displayName = MenuPrimitive.Trigger.displayName;

const MenuBackdrop = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Backdrop>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Backdrop
    ref={ref}
    className={clsx('canon-MenuBackdrop', className)}
    {...props}
  />
));
MenuBackdrop.displayName = MenuPrimitive.Backdrop.displayName;

const MenuPositioner = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Positioner
    ref={ref}
    className={clsx('canon-MenuPositioner', className)}
    {...props}
  />
));
MenuPositioner.displayName = MenuPrimitive.Positioner.displayName;

const MenuPopup = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Popup
    ref={ref}
    className={clsx('canon-MenuPopup', className)}
    {...props}
  />
));
MenuPopup.displayName = MenuPrimitive.Popup.displayName;

const MenuArrow = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Arrow
    ref={ref}
    className={clsx('canon-MenuArrow', className)}
    {...props}
  />
));
MenuArrow.displayName = MenuPrimitive.Arrow.displayName;

const MenuItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Item
    ref={ref}
    className={clsx('canon-MenuItem', className)}
    {...props}
  />
));
MenuItem.displayName = MenuPrimitive.Item.displayName;

const MenuGroup = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Group
    ref={ref}
    className={clsx('canon-MenuGroup', className)}
    {...props}
  />
));
MenuGroup.displayName = MenuPrimitive.Group.displayName;

const MenuGroupLabel = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={clsx('canon-MenuGroupLabel', className)}
    {...props}
  />
));
MenuGroupLabel.displayName = MenuPrimitive.GroupLabel.displayName;

const MenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.RadioGroup
    ref={ref}
    className={clsx('canon-MenuRadioGroup', className)}
    {...props}
  />
));
MenuRadioGroup.displayName = MenuPrimitive.RadioGroup.displayName;

const MenuRadioItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={clsx('canon-MenuRadioItem', className)}
    {...props}
  />
));
MenuRadioItem.displayName = MenuPrimitive.RadioItem.displayName;

const MenuRadioItemIndicator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItemIndicator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItemIndicator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.RadioItemIndicator
    ref={ref}
    className={clsx('canon-MenuRadioItemIndicator', className)}
    {...props}
  />
));
MenuRadioItemIndicator.displayName =
  MenuPrimitive.RadioItemIndicator.displayName;

const MenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={clsx('canon-MenuCheckboxItem', className)}
    {...props}
  />
));
MenuCheckboxItem.displayName = MenuPrimitive.CheckboxItem.displayName;

const MenuCheckboxItemIndicator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItemIndicator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItemIndicator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.CheckboxItemIndicator
    ref={ref}
    className={clsx('canon-MenuCheckboxItemIndicator', className)}
    {...props}
  />
));
MenuCheckboxItemIndicator.displayName =
  MenuPrimitive.CheckboxItemIndicator.displayName;

const MenuSubmenuTrigger = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
    ref={ref}
    className={clsx('canon-MenuSubmenuTrigger', className)}
    {...props}
  />
));
MenuSubmenuTrigger.displayName = MenuPrimitive.SubmenuTrigger.displayName;

const MenuSeparator = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={clsx('canon-MenuSeparator', className)}
    {...props}
  />
));
MenuSeparator.displayName = MenuPrimitive.Separator.displayName;

/** @public */
export const Menu: MenuComponent = {
  Root: MenuPrimitive.Root,
  Trigger: MenuTrigger,
  Portal: MenuPrimitive.Portal,
  Backdrop: MenuBackdrop,
  Positioner: MenuPositioner,
  Popup: MenuPopup,
  Arrow: MenuArrow,
  Item: MenuItem,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  RadioItemIndicator: MenuRadioItemIndicator,
  CheckboxItem: MenuCheckboxItem,
  CheckboxItemIndicator: MenuCheckboxItemIndicator,
  SubmenuTrigger: MenuSubmenuTrigger,
  Separator: MenuSeparator,
};
