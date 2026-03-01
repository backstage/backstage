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

import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Radix UI Tooltip provider — required at the app root (or a parent scope)
 * to supply shared delay and skip-delay configuration to all nested tooltips.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Root tooltip component wrapping the Radix Tooltip primitive.
 * Named ShadcnTooltip to avoid collisions with MUI Tooltip during migration.
 */
const ShadcnTooltip = TooltipPrimitive.Root;

/**
 * The element that triggers the tooltip on hover / focus.
 * Supports `asChild` to merge props into the child element.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content rendered inside a portal with enter/exit animations.
 * Default sideOffset is 4 px from the trigger.
 */
const TooltipContent = forwardRef<
  ComponentRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      data-slot="tooltip-content"
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { ShadcnTooltip, TooltipTrigger, TooltipContent, TooltipProvider };
