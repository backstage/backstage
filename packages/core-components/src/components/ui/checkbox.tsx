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
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { Check } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Accessible checkbox component built on the Radix UI Checkbox primitive,
 * styled with Tailwind CSS following the shadcn/ui new-york convention.
 *
 * @remarks
 * Replaces MUI {@link https://v4.mui.com/components/checkboxes/ | Checkbox}
 * across OAuthRequestDialog, data-table row selection, and form fields.
 *
 * Features provided by the Radix primitive:
 * - Built-in keyboard toggling via Space key
 * - ARIA `checkbox` role with `checked` / `unchecked` / `indeterminate` states
 * - Form-field association through native `name` and `value` props
 *
 * @example
 * ```tsx
 * import { Checkbox } from '../components/ui/checkbox';
 *
 * // Basic controlled usage
 * <Checkbox checked={isSelected} onCheckedChange={setIsSelected} />
 *
 * // Disabled state
 * <Checkbox disabled />
 *
 * // With a label (pair with Radix Label or html <label>)
 * <div className="flex items-center gap-2">
 *   <Checkbox id="terms" />
 *   <label htmlFor="terms">Accept terms</label>
 * </div>
 * ```
 *
 * @public
 */
const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
