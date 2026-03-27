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
import { Command as CommandPrimitive } from 'cmdk';
import { Dialog } from 'radix-ui';
import { Search } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Root Command component built on cmdk for keyboard-first search/command palette.
 * Powers the global search (Cmd/Ctrl+K) pattern in Backstage, replacing the
 * legacy SidebarSearchModal. Provides a Discord/Linear-style filterable
 * command menu with full keyboard navigation support.
 *
 * @public
 */
const Command = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

/**
 * Command palette rendered inside a Radix Dialog overlay.
 * Combines Radix Dialog primitives with the Command component to create a
 * modal command palette activated by keyboard shortcut (Cmd/Ctrl+K).
 *
 * Includes a visually hidden Dialog.Title for accessibility — Radix Dialog
 * requires a title for screen reader announcement.
 *
 * @public
 */
function CommandDialog({
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Root>) {
  /**
   * Track the element that had focus when the dialog was opened so we can
   * restore it on close (WCAG 2.4.3 — Focus Order). Radix Dialog normally
   * handles this, but cmdk's CommandDialog does not always propagate the
   * focus-restoration behaviour, so we manage it explicitly.
   */
  const triggerRef = React.useRef<HTMLElement | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
    } else {
      // Restore focus to the element that opened the dialog
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
        triggerRef.current = null;
      });
    }
    props.onOpenChange?.(open);
  };

  return (
    <Dialog.Root {...props} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg border border-border bg-popover p-0 shadow-lg"
          aria-modal="true"
        >
          <Dialog.Title className="sr-only">Command Palette</Dialog.Title>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12">
            {children}
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* eslint-disable react/no-unknown-property -- cmdk-input-wrapper is a required cmdk library data attribute */

/**
 * Search input inside the command palette with a leading Search icon.
 * Wraps cmdk's Input primitive with Backstage styling and an accessible
 * search affordance. The wrapper carries the `cmdk-input-wrapper` attribute
 * that cmdk uses internally for event delegation.
 *
 * @public
 */
const CommandInput = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-border px-3"
    data-slot="command-input-wrapper"
    cmdk-input-wrapper=""
  >
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = 'CommandInput';

/* eslint-enable react/no-unknown-property */

/**
 * Scrollable results list container for command items.
 * Wraps cmdk's List primitive with scroll behavior and constrained height
 * to prevent the command palette from growing unbounded.
 *
 * @public
 */
const CommandList = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = 'CommandList';

/**
 * Message displayed when no command items match the current query.
 * Shown automatically by cmdk when the filtered list is empty.
 *
 * @public
 */
const CommandEmpty = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = 'CommandEmpty';

/**
 * Named group of command items with an optional heading label.
 * Groups are automatically hidden by cmdk when all child items are filtered
 * out, keeping the palette tidy.
 *
 * @public
 */
const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
));
CommandGroup.displayName = 'CommandGroup';

/**
 * Visual separator line between command groups.
 * Renders a thin horizontal rule styled with the border token color.
 *
 * @public
 */
const CommandSeparator = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn('-mx-1 h-px bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

/**
 * Individual selectable command item within a group.
 * Renders with hover/selected states via Tailwind data-attribute selectors.
 * Disabled items are visually dimmed and non-interactive.
 *
 * @public
 */
const CommandItem = React.forwardRef<
  React.ComponentRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      'relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
      'data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = 'CommandItem';

/**
 * Keyboard shortcut hint rendered inline within a CommandItem.
 * Displays at the trailing edge of the item, styled with muted foreground
 * and widened letter-spacing for readability (e.g. "⌘K", "⇧⌘P").
 *
 * @public
 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
