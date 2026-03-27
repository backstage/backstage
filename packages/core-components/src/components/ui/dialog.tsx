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
import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

/* ---------------------------------- Root ---------------------------------- */

/**
 * Root Dialog component wrapping Radix UI Dialog.Root.
 * Controls the open/closed state of the dialog.
 *
 * Includes explicit focus restoration logic (WCAG 2.4.3 — Focus Order):
 * when the dialog closes, focus returns to the element that was active
 * before the dialog opened. This supplements Radix's built-in focus
 * management which may not fire in all conditional rendering patterns.
 *
 * @example
 * ```tsx
 * <ShadcnDialog open={isOpen} onOpenChange={setIsOpen}>
 *   <DialogTrigger asChild>
 *     <Button>Open</Button>
 *   </DialogTrigger>
 *   <ShadcnDialogContent>
 *     <DialogHeader>
 *       <ShadcnDialogTitle>Title</ShadcnDialogTitle>
 *       <DialogDescription>Description</DialogDescription>
 *     </DialogHeader>
 *   </ShadcnDialogContent>
 * </ShadcnDialog>
 * ```
 *
 * @public
 */
/**
 * Root Dialog component wrapping Radix UI Dialog.Root with explicit
 * focus restoration for WCAG 2.4.3 compliance.
 *
 * Tracks the element that had focus before the dialog opened and restores
 * it on close. This handles both declarative trigger usage and controlled
 * `open` prop patterns (e.g., SearchModal) where Radix's built-in focus
 * restoration may not fire.
 *
 * @public
 */
function ShadcnDialog({
  children,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const wasOpen = React.useRef(false);

  // Capture the previously focused element when the dialog transitions
  // from closed to open via the controlled `open` prop.
  React.useEffect(() => {
    if (open && !wasOpen.current) {
      triggerRef.current = document.activeElement as HTMLElement | null;
    }
    wasOpen.current = !!open;
  }, [open]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && triggerRef.current?.isConnected) {
      // Schedule focus restoration after the dialog unmounts
      const target = triggerRef.current;
      requestAnimationFrame(() => {
        target?.focus();
      });
      triggerRef.current = null;
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  );
}

/**
 * Button or element that opens the dialog when activated.
 * Wraps Radix UI Dialog.Trigger.
 *
 * @public
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * Portal container that renders dialog content into document.body
 * to avoid stacking context and overflow issues.
 * Wraps Radix UI Dialog.Portal.
 *
 * @public
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * Button or element that closes the dialog when activated.
 * Wraps Radix UI Dialog.Close.
 *
 * @public
 */
const DialogClose = DialogPrimitive.Close;

/* -------------------------------- Overlay --------------------------------- */

/**
 * Semi-transparent backdrop overlay rendered behind the dialog content.
 * Provides fade-in/fade-out animation tied to the dialog open state.
 *
 * @public
 */
const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/80',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = 'DialogOverlay';

/* -------------------------------- Content --------------------------------- */

/**
 * Centered dialog content panel with a built-in close button.
 * Automatically renders inside a DialogPortal with a DialogOverlay backdrop.
 *
 * Includes animated enter/exit transitions:
 * - Fade in/out
 * - Zoom in (95% → 100%) / zoom out (100% → 95%)
 * - Slide from center positioning
 *
 * A close button with an X icon and screen-reader-only "Close" label is
 * rendered in the top-right corner by default.
 *
 * @remarks
 * Named `ShadcnDialogContent` to avoid naming conflicts with the existing
 * Backstage `DialogContent` component exported from the `./Dialog` barrel.
 *
 * @public
 */
const ShadcnDialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      data-slot="dialog-content"
      aria-modal="true"
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
ShadcnDialogContent.displayName = 'ShadcnDialogContent';

/* ------------------------------- Header ---------------------------------- */

/**
 * Layout helper for the dialog header section.
 * Renders a flex column container with consistent spacing
 * and responsive text alignment (center on mobile, left on sm+).
 *
 * @public
 */
function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  );
}
DialogHeader.displayName = 'DialogHeader';

/* ------------------------------- Footer ---------------------------------- */

/**
 * Layout helper for the dialog footer section.
 * Renders action buttons in a column (reversed for mobile natural order)
 * and a row with end-aligned spacing on sm+ screens.
 *
 * @public
 */
function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  );
}
DialogFooter.displayName = 'DialogFooter';

/* -------------------------------- Title ---------------------------------- */

/**
 * Accessible dialog title rendered as an h2 heading by Radix.
 * Connected to the dialog content via `aria-labelledby` automatically.
 *
 * @remarks
 * Named `ShadcnDialogTitle` to avoid naming conflicts with the existing
 * Backstage `DialogTitle` component exported from the `./Dialog` barrel.
 *
 * @public
 */
const ShadcnDialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
ShadcnDialogTitle.displayName = 'ShadcnDialogTitle';

/* ----------------------------- Description ------------------------------- */

/**
 * Accessible dialog description text.
 * Connected to the dialog content via `aria-describedby` automatically.
 * Rendered in muted foreground color at a smaller text size.
 *
 * @public
 */
const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    data-slot="dialog-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

/* -------------------------------- Exports -------------------------------- */

export {
  ShadcnDialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  ShadcnDialogContent,
  DialogHeader,
  DialogFooter,
  ShadcnDialogTitle,
  DialogDescription,
};
