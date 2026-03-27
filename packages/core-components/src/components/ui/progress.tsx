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
import { Progress as ProgressPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Accessible progress bar component built on Radix UI Progress primitive,
 * styled with Tailwind CSS following the shadcn/ui new-york convention.
 *
 * Replaces MUI `LinearProgress` across loading states, including the
 * ProxiedSignInPage and AutoLogout countdown components.
 *
 * @remarks
 * The component renders a horizontal progress track with an animated
 * indicator that translates along the X axis based on the current `value`.
 * Radix UI's Progress primitive provides built-in ARIA `progressbar` role,
 * `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` attributes
 * for assistive technology support.
 *
 * Named `ProgressIndicator` to avoid naming conflict with the existing
 * Backstage `Progress` component exported from `../Progress/`.
 *
 * @example
 * ```tsx
 * import { ProgressIndicator } from '../ui/progress';
 *
 * // Determinate progress (0–100)
 * <ProgressIndicator value={65} />
 *
 * // Indeterminate / starting state
 * <ProgressIndicator value={0} />
 *
 * // With custom className override
 * <ProgressIndicator value={40} className="h-3 bg-muted" />
 * ```
 *
 * @public
 */
const ProgressIndicator = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    data-slot="progress"
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
ProgressIndicator.displayName = 'ProgressIndicator';

export { ProgressIndicator };
