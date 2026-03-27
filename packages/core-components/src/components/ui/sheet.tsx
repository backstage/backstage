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
import { Dialog } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

/* ---------------------------------------------------------------------------
 * Sheet Root — wraps Radix Dialog.Root to provide open/close state management
 * for the sheet panel. Accepts `open`, `defaultOpen`, `onOpenChange` props.
 * -------------------------------------------------------------------------- */

const Sheet = Dialog.Root;

/* ---------------------------------------------------------------------------
 * SheetTrigger — wraps Radix Dialog.Trigger as the interactive element that
 * opens the sheet when activated.
 * -------------------------------------------------------------------------- */

const SheetTrigger = Dialog.Trigger;

/* ---------------------------------------------------------------------------
 * SheetClose — wraps Radix Dialog.Close as the interactive element that
 * closes the sheet when activated.
 * -------------------------------------------------------------------------- */

const SheetClose = Dialog.Close;

/* ---------------------------------------------------------------------------
 * SheetPortal — wraps Radix Dialog.Portal to render sheet content into a
 * React portal outside the DOM hierarchy of the parent component.
 * -------------------------------------------------------------------------- */

const SheetPortal = Dialog.Portal;

/* ---------------------------------------------------------------------------
 * SheetOverlay — semi-transparent backdrop rendered behind the sheet content.
 * Provides click-to-close behavior and fade-in/fade-out animations via
 * Tailwind data-attribute animation classes.
 * -------------------------------------------------------------------------- */

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    data-slot="sheet-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
SheetOverlay.displayName = 'SheetOverlay';

/* ---------------------------------------------------------------------------
 * sheetVariants — type-safe CSS variant system using class-variance-authority.
 * Defines base classes for the sheet panel plus 4 side variants controlling
 * positioning, border direction, and slide-in/slide-out animation direction.
 * -------------------------------------------------------------------------- */

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

/* ---------------------------------------------------------------------------
 * SheetContent — main panel rendered inside a portal with overlay backdrop.
 * Supports 4 side variants (top/bottom/left/right) for slide-in direction.
 * Includes an accessible close button with X icon in the top-right corner.
 *
 * Replaces MUI Drawer for sidebar navigation, mobile drawers, and side
 * panel overlays throughout Backstage.
 *
 * @public
 * -------------------------------------------------------------------------- */

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof Dialog.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      data-slot="sheet-content"
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <Dialog.Close
        className={cn(
          'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background',
          'transition-opacity hover:opacity-100',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:pointer-events-none data-[state=open]:bg-secondary',
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
      {children}
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

/* ---------------------------------------------------------------------------
 * SheetHeader — flex column layout for the sheet's header area containing
 * the title and optional description. Centers text on mobile, left-aligns
 * on sm+ breakpoints.
 * -------------------------------------------------------------------------- */

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sheet-header"
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

/* ---------------------------------------------------------------------------
 * SheetFooter — flex layout for the sheet's footer area with action buttons.
 * Stacks vertically (reversed) on mobile, aligns horizontally on sm+
 * breakpoints with end-justified spacing.
 * -------------------------------------------------------------------------- */

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="sheet-footer"
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

/* ---------------------------------------------------------------------------
 * SheetTitle — accessible title rendered via Radix Dialog.Title with
 * foreground-colored semibold typography.
 * -------------------------------------------------------------------------- */

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    data-slot="sheet-title"
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = 'SheetTitle';

/* ---------------------------------------------------------------------------
 * SheetDescription — accessible description rendered via Radix
 * Dialog.Description with muted-foreground small typography.
 * -------------------------------------------------------------------------- */

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    data-slot="sheet-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = 'SheetDescription';

/* ---------------------------------------------------------------------------
 * Public exports
 * -------------------------------------------------------------------------- */

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
