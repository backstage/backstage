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
import { Separator as SeparatorPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Accessible separator (horizontal or vertical divider) built on the Radix UI
 * Separator primitive, styled with Tailwind CSS following the shadcn/ui
 * new-york convention.
 *
 * @remarks
 * This component replaces MUI's {@link https://v4.mui.com/api/divider/ | Divider}
 * component throughout the Backstage core UI. It is used between content
 * sections, inside card headers/footers, and within sidebar groups.
 *
 * The separator defaults to `decorative` mode (`aria-hidden="true"`) because
 * the majority of usage in Backstage is purely visual. When the separator
 * carries semantic meaning (e.g. separating distinct landmark regions), set
 * `decorative={false}` so that it renders as `role="separator"` and is
 * announced by assistive technology.
 *
 * Orientation controls both the ARIA `aria-orientation` attribute and the
 * rendered dimensions:
 * - `"horizontal"` (default) — 1 px tall, full width
 * - `"vertical"` — full height, 1 px wide
 *
 * The visual colour is driven by the `--border` CSS custom property token
 * (`bg-border` utility class), ensuring automatic light/dark theme support.
 *
 * @example
 * ```tsx
 * import { Separator } from '../components/ui/separator';
 *
 * // Horizontal separator (default)
 * <Separator />
 *
 * // Vertical separator inside a flex row
 * <div className="flex items-center gap-4">
 *   <span>Left</span>
 *   <Separator orientation="vertical" className="h-6" />
 *   <span>Right</span>
 * </div>
 *
 * // Semantic separator between landmark regions
 * <Separator decorative={false} />
 * ```
 *
 * @public
 */
const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      data-slot="separator"
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
