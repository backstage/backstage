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
import { Label as LabelPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/**
 * Tailwind CSS class variants for the Label component.
 *
 * @remarks
 * Defines the base styling for form labels following the shadcn/ui new-york
 * style convention. Includes peer-disabled state styling that automatically
 * dims the label and disables pointer events when the associated form control
 * (a preceding sibling with the `peer` class) is disabled.
 *
 * @internal
 */
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

/**
 * Accessible label component built on the Radix UI Label primitive.
 *
 * @remarks
 * Wraps the Radix Label.Root primitive with shadcn/ui styling conventions,
 * providing consistent typography (text-sm, font-medium) and automatic
 * peer-disabled state styling for form accessibility. Supports the standard
 * `htmlFor` prop to associate with form inputs, inheriting all accessible
 * label semantics from Radix.
 *
 * Uses the `data-slot="label"` attribute for component identification in the
 * shadcn/ui new-york style pattern.
 *
 * @example
 * ```tsx
 * import { Label } from '../components/ui/label';
 *
 * // Basic usage with htmlFor association
 * <Label htmlFor="email">Email address</Label>
 *
 * // With custom className override
 * <Label htmlFor="name" className="text-base font-semibold">Full name</Label>
 *
 * // Peer-disabled styling (label dims when sibling input is disabled)
 * <input id="field" className="peer" disabled />
 * <Label htmlFor="field">Disabled field</Label>
 * ```
 *
 * @public
 */
const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
