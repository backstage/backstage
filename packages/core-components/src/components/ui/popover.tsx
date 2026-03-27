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
import { Popover as PopoverPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Radix UI Popover root container that manages open/closed state.
 * Replaces MUI Popover root used in SupportButton, Breadcrumbs overflow,
 * and entity context menus throughout the Backstage portal.
 *
 * @public
 */
const Popover = PopoverPrimitive.Root;

/**
 * Popover trigger element — the button or interactive element that
 * toggles the popover open/closed. Wraps its child with proper
 * aria-expanded and aria-controls attributes automatically.
 *
 * @public
 */
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Popover anchor element — an optional positioning anchor that the
 * popover content aligns to instead of the trigger. Useful when the
 * visual anchor differs from the interactive trigger.
 *
 * @public
 */
const PopoverAnchor = PopoverPrimitive.Anchor;

/**
 * Popover content panel with collision detection and portal rendering.
 * Replaces MUI Popover content across SupportButton, Breadcrumbs overflow,
 * and header action menus. Renders into a React portal to avoid clipping
 * by parent overflow containers, and automatically adjusts positioning
 * when the popover would overflow viewport boundaries.
 *
 * Features:
 * - Portal rendering to avoid parent overflow clipping
 * - Collision-aware positioning via Radix primitives
 * - Direction-aware open/close animations (slide + fade + zoom)
 * - Keyboard dismiss support (Escape key)
 * - Focus trapping within popover content
 * - CSS custom property token theming (bg-popover, text-popover-foreground)
 *
 * @public
 */
const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      data-slot="popover-content"
      className={cn(
        'z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
