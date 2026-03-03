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
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cn } from '../../lib/utils';

/**
 * Scrollable area with custom scrollbars built on Radix ScrollArea.
 *
 * Provides accessible, cross-browser custom-styled scrollable regions
 * for virtualized content like LogViewer, long entity lists, and sidebar
 * content overflow. Augments native browser scrollbars with styled
 * alternatives while retaining full keyboard and assistive-technology
 * support via the Radix ScrollArea primitive.
 *
 * @public
 */
/* eslint-disable @typescript-eslint/no-use-before-define -- ScrollBar is co-defined below */
const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    data-slot="scroll-area"
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
/* eslint-enable @typescript-eslint/no-use-before-define */
ScrollArea.displayName = 'ScrollArea';

/**
 * Custom scrollbar with thumb and track styling supporting both vertical
 * and horizontal orientations.
 *
 * Renders a styled Radix Scrollbar with touch-none and select-none
 * interaction semantics and smooth color transitions. The thumb uses
 * the `bg-border` token colour and rounded-full corners.
 *
 * @public
 */
const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    data-slot="scroll-bar"
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
