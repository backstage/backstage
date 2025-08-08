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

import { forwardRef } from 'react';
import { Menu as MenuPrimitive } from '@base-ui-components/react/menu';
import clsx from 'clsx';
import { MenuComponent } from './types';
import { Combobox } from './Combobox';
import { Icon } from '../Icon';
import { useStyles } from '../../hooks/useStyles';

const MenuTrigger = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Trigger
      ref={ref}
      className={clsx(classNames.trigger, className)}
      {...props}
    />
  );
});
MenuTrigger.displayName = MenuPrimitive.Trigger.displayName;

const MenuBackdrop = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Backdrop>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Backdrop>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Backdrop
      ref={ref}
      className={clsx(classNames.backdrop, className)}
      {...props}
    />
  );
});
MenuBackdrop.displayName = MenuPrimitive.Backdrop.displayName;

const MenuPositioner = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Positioner>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Positioner
      ref={ref}
      className={clsx(classNames.positioner, className)}
      {...props}
    />
  );
});
MenuPositioner.displayName = MenuPrimitive.Positioner.displayName;

const MenuPopup = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Popup>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Popup
      ref={ref}
      className={clsx(classNames.popup, className)}
      {...props}
    />
  );
});
MenuPopup.displayName = MenuPrimitive.Popup.displayName;

const MenuArrow = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Arrow>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Arrow
      ref={ref}
      className={clsx(classNames.arrow, className)}
      {...props}
    />
  );
});
MenuArrow.displayName = MenuPrimitive.Arrow.displayName;

const MenuItem = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Item
      ref={ref}
      className={clsx(classNames.item, className)}
      {...props}
    />
  );
});
MenuItem.displayName = MenuPrimitive.Item.displayName;

const MenuGroup = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Group
      ref={ref}
      className={clsx(classNames.group, className)}
      {...props}
    />
  );
});
MenuGroup.displayName = MenuPrimitive.Group.displayName;

const MenuGroupLabel = forwardRef<
  React.ElementRef<typeof MenuPrimitive.GroupLabel>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.GroupLabel>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.GroupLabel
      ref={ref}
      className={clsx(classNames.groupLabel, className)}
      {...props}
    />
  );
});
MenuGroupLabel.displayName = MenuPrimitive.GroupLabel.displayName;

const MenuRadioGroup = forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioGroup>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.RadioGroup
      ref={ref}
      className={clsx(classNames.radioGroup, className)}
      {...props}
    />
  );
});
MenuRadioGroup.displayName = MenuPrimitive.RadioGroup.displayName;

const MenuRadioItem = forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.RadioItem
      ref={ref}
      className={clsx(classNames.radioItem, className)}
      {...props}
    />
  );
});
MenuRadioItem.displayName = MenuPrimitive.RadioItem.displayName;

const MenuRadioItemIndicator = forwardRef<
  React.ElementRef<typeof MenuPrimitive.RadioItemIndicator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItemIndicator>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.RadioItemIndicator
      ref={ref}
      className={clsx(classNames.radioItemIndicator, className)}
      {...props}
    />
  );
});
MenuRadioItemIndicator.displayName =
  MenuPrimitive.RadioItemIndicator.displayName;

const MenuCheckboxItem = forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.CheckboxItem
      ref={ref}
      className={clsx(classNames.checkboxItem, className)}
      {...props}
    />
  );
});
MenuCheckboxItem.displayName = MenuPrimitive.CheckboxItem.displayName;

const MenuCheckboxItemIndicator = forwardRef<
  React.ElementRef<typeof MenuPrimitive.CheckboxItemIndicator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItemIndicator>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.CheckboxItemIndicator
      ref={ref}
      className={clsx(classNames.checkboxItemIndicator, className)}
      {...props}
    />
  );
});
MenuCheckboxItemIndicator.displayName =
  MenuPrimitive.CheckboxItemIndicator.displayName;

const MenuSubmenuTrigger = forwardRef<
  React.ElementRef<typeof MenuPrimitive.SubmenuTrigger>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.SubmenuTrigger>
>(({ className, children, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.SubmenuTrigger
      ref={ref}
      className={clsx(classNames.submenuTrigger, className)}
      {...props}
    >
      <div>{children}</div>
      <Icon
        aria-label="Submenu indicator icon"
        name="chevron-right"
        size={20}
      />
    </MenuPrimitive.SubmenuTrigger>
  );
});
MenuSubmenuTrigger.displayName = MenuPrimitive.SubmenuTrigger.displayName;

const MenuSeparator = forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Menu');

  return (
    <MenuPrimitive.Separator
      ref={ref}
      className={clsx(classNames.separator, className)}
      {...props}
    />
  );
});
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
  Combobox,
};
