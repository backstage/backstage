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
import { Tooltip as TooltipPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Radix UI Tooltip provider — required at the app root (or a parent scope)
 * to supply shared delay and skip-delay configuration to all nested tooltips.
 *
 * @remarks
 * Wrap your application or a subtree with `<TooltipProvider>` to enable
 * coordinated tooltip delays. When a user moves between tooltip triggers
 * within the skip-delay window, subsequent tooltips open instantly.
 *
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={300} skipDelayDuration={150}>
 *   <App />
 * </TooltipProvider>
 * ```
 *
 * @public
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Root tooltip component wrapping the Radix Tooltip primitive.
 *
 * @remarks
 * Named `ShadcnTooltip` to avoid naming collisions with the MUI `Tooltip`
 * component during the migration period. Consumer code and other Backstage
 * components can import `ShadcnTooltip` without ambiguity.
 *
 * @example
 * ```tsx
 * <ShadcnTooltip>
 *   <TooltipTrigger asChild>
 *     <button>Hover me</button>
 *   </TooltipTrigger>
 *   <TooltipContent>Helpful tip</TooltipContent>
 * </ShadcnTooltip>
 * ```
 *
 * @public
 */
const ShadcnTooltip = TooltipPrimitive.Root;

/**
 * The element that triggers the tooltip on hover / focus.
 *
 * @remarks
 * Supports `asChild` to merge tooltip trigger props into the child element
 * rather than wrapping it in an additional DOM node, preserving the
 * semantic markup of the trigger.
 *
 * @public
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * Tooltip content rendered inside a Radix portal with animated enter/exit
 * transitions. Positioned relative to the trigger with collision-aware
 * placement via Radix's floating-UI integration.
 *
 * @remarks
 * Default `sideOffset` is 4px from the trigger edge. The component
 * renders inside a portal so it is not clipped by `overflow: hidden`
 * ancestors. Animation classes handle fade + zoom on open/close and
 * directional slide based on the computed tooltip side.
 *
 * @example
 * ```tsx
 * <ShadcnTooltip>
 *   <TooltipTrigger asChild>
 *     <button aria-label="Copy">
 *       <CopyIcon />
 *     </button>
 *   </TooltipTrigger>
 *   <TooltipContent side="top" sideOffset={8}>
 *     Copy to clipboard
 *   </TooltipContent>
 * </ShadcnTooltip>
 * ```
 *
 * @public
 */
const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
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
