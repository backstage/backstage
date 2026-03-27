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
import { Switch as SwitchPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * An accessible toggle switch component built on the Radix UI Switch primitive,
 * styled with Tailwind CSS following the shadcn/ui new-york convention.
 *
 * @remarks
 * Provides a binary on/off control with built-in keyboard toggling (Space key),
 * ARIA `switch` role, and managed checked/unchecked state from Radix UI.
 * The thumb slides horizontally via a CSS translate transition keyed to the
 * `data-state` attribute emitted by the Radix primitive.
 *
 * Used in user-settings for theme toggle, feature flags, and notification
 * preferences throughout the Backstage developer portal.
 *
 * @example
 * ```tsx
 * import { Switch } from '../components/ui/switch';
 *
 * // Uncontrolled
 * <Switch defaultChecked />
 *
 * // Controlled
 * <Switch checked={isDark} onCheckedChange={setIsDark} />
 *
 * // Disabled
 * <Switch disabled />
 *
 * // With label
 * <label htmlFor="dark-mode" className="text-sm">Dark mode</label>
 * <Switch id="dark-mode" />
 * ```
 *
 * @public
 */
const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className,
    )}
    {...props}
    ref={ref}
    data-slot="switch"
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
