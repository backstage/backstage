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

import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '../../lib/utils';

/* -------------------------------------------------------------------------
 * navigationMenuTriggerStyle
 * ------------------------------------------------------------------------- */

/**
 * Shared Tailwind CSS class string generator for navigation menu trigger and
 * link styling. Built with `class-variance-authority` to enable type-safe
 * variant composition if extended in the future.
 *
 * @remarks
 * Provides consistent hover, focus, active, and disabled states across
 * navigation menu trigger elements. Applied by {@link NavigationMenuTrigger}
 * automatically and available for use on {@link NavigationMenuLink} when a
 * trigger-like visual style is desired.
 *
 * @example
 * ```tsx
 * <NavigationMenuLink className={navigationMenuTriggerStyle()}>
 *   Dashboard
 * </NavigationMenuLink>
 * ```
 *
 * @public
 */
const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
);

/* -------------------------------------------------------------------------
 * NavigationMenu (Root)
 * ------------------------------------------------------------------------- */

/* eslint-disable @typescript-eslint/no-use-before-define --
   NavigationMenuViewport is co-defined below in this module and referenced
   inside the NavigationMenu root component. */

/**
 * Root NavigationMenu container built on the Radix UI NavigationMenu
 * primitive. Automatically renders a {@link NavigationMenuViewport} as a
 * sibling of `children` to host sub-menu content panels.
 *
 * @remarks
 * Replaces MUI `BottomNavigation` / `BottomNavigationAction` for sidebar
 * navigation and mobile bottom navigation in Backstage. Radix primitives
 * supply built-in keyboard navigation, ARIA attributes, and sub-menu
 * management out of the box.
 *
 * @example
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenuList>
 *     <NavigationMenuItem>
 *       <NavigationMenuTrigger>Catalog</NavigationMenuTrigger>
 *       <NavigationMenuContent>…</NavigationMenuContent>
 *     </NavigationMenuItem>
 *   </NavigationMenuList>
 * </NavigationMenu>
 * ```
 *
 * @public
 */
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    data-slot="navigation-menu"
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className,
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = 'NavigationMenu';

/* eslint-enable @typescript-eslint/no-use-before-define */

/* -------------------------------------------------------------------------
 * NavigationMenuList
 * ------------------------------------------------------------------------- */

/**
 * Horizontal list container for navigation menu items. Wraps
 * `NavigationMenuPrimitive.List` with consistent flex layout and spacing.
 *
 * @public
 */
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    data-slot="navigation-menu-list"
    className={cn(
      'group flex flex-1 list-none items-center justify-center space-x-1',
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

/* -------------------------------------------------------------------------
 * NavigationMenuItem
 * ------------------------------------------------------------------------- */

/**
 * Individual navigation menu item wrapping `NavigationMenuPrimitive.Item`.
 * Serves as a container for a trigger + content pair or a standalone link.
 *
 * @public
 */
const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    data-slot="navigation-menu-item"
    className={cn(className)}
    {...props}
  />
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

/* -------------------------------------------------------------------------
 * NavigationMenuTrigger
 * ------------------------------------------------------------------------- */

/**
 * Trigger button that opens a navigation sub-menu. Includes a
 * {@link https://lucide.dev/icons/chevron-down | ChevronDown} icon that
 * rotates 180° when the associated content panel is open.
 *
 * @remarks
 * Uses {@link navigationMenuTriggerStyle} for base styling. The chevron icon
 * is decorative (`aria-hidden`) and animated via the Radix
 * `data-[state=open]` attribute.
 *
 * @public
 */
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    data-slot="navigation-menu-trigger"
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}{' '}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

/* -------------------------------------------------------------------------
 * NavigationMenuContent
 * ------------------------------------------------------------------------- */

/**
 * Content panel for a navigation sub-menu. Slides in/out with directional
 * animation based on the Radix `data-motion` attribute.
 *
 * @remarks
 * On medium-and-above viewports the content is absolutely positioned;
 * on narrow screens it takes full width. Animations use Tailwind CSS
 * `animate-in` / `animate-out` utilities driven by
 * `data-[motion^=from-]` and `data-[motion^=to-]` selectors.
 *
 * @public
 */
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    data-slot="navigation-menu-content"
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
      'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
      'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52',
      'data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52',
      'md:absolute md:w-auto',
      className,
    )}
    {...props}
  />
));
NavigationMenuContent.displayName = 'NavigationMenuContent';

/* -------------------------------------------------------------------------
 * NavigationMenuLink
 * ------------------------------------------------------------------------- */

/**
 * Accessible link primitive within a navigation menu. Wraps
 * `NavigationMenuPrimitive.Link` with a `data-slot` attribute for
 * consistent identification and styling hooks.
 *
 * @remarks
 * Use `asChild` when composing with React Router `<Link>` or other routing
 * primitives. Apply `navigationMenuTriggerStyle()` to the `className` when
 * a trigger-like visual appearance is desired on standalone links.
 *
 * @example
 * ```tsx
 * <NavigationMenuLink asChild>
 *   <Link to="/catalog">Catalog</Link>
 * </NavigationMenuLink>
 * ```
 *
 * @public
 */
const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Link
    ref={ref}
    data-slot="navigation-menu-link"
    className={cn(className)}
    {...props}
  />
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

/* -------------------------------------------------------------------------
 * NavigationMenuViewport
 * ------------------------------------------------------------------------- */

/**
 * Viewport container for rendered navigation content panels. Positioned
 * below the navigation menu bar and animated on open/close.
 *
 * @remarks
 * Automatically rendered by the {@link NavigationMenu} root component. It is
 * also exported separately for advanced layout customizations where the
 * viewport must be placed independently from the root. The viewport height
 * and width are driven by CSS custom properties set by the Radix primitive:
 * `--radix-navigation-menu-viewport-height` and
 * `--radix-navigation-menu-viewport-width`.
 *
 * @public
 */
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div
    className={cn('absolute left-0 top-full flex justify-center')}
    data-slot="navigation-menu-viewport-wrapper"
  >
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90',
        'md:w-[var(--radix-navigation-menu-viewport-width)]',
        className,
      )}
      data-slot="navigation-menu-viewport"
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

/* -------------------------------------------------------------------------
 * NavigationMenuIndicator
 * ------------------------------------------------------------------------- */

/**
 * Active indicator positioned at the bottom of the current navigation item.
 * Contains a small rotated diamond shape that slides horizontally to track
 * the active trigger.
 *
 * @remarks
 * The indicator is animated via Radix `data-[state=visible]` and
 * `data-[state=hidden]` attributes for smooth fade-in/fade-out transitions.
 * The diamond is rendered as a rotated `div` with `bg-border` background.
 *
 * @public
 */
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    data-slot="navigation-menu-indicator"
    className={cn(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
      'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className,
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

/* -------------------------------------------------------------------------
 * Exports
 * ------------------------------------------------------------------------- */

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
