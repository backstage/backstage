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
import { VisuallyHidden as VisuallyHiddenPrimitive } from 'radix-ui';

/**
 * VisuallyHidden — accessible screen-reader-only utility component.
 *
 * Wraps the Radix UI VisuallyHidden primitive to render content that is
 * visually hidden but remains available to screen readers. Uses the standard
 * sr-only CSS pattern (clip-rect, position absolute, overflow hidden, 1px
 * dimensions).
 *
 * Common use cases:
 * - Accessible labels on icon-only buttons
 * - Descriptive text for decorative elements
 * - ARIA descriptions that should not be visible
 *
 * @example
 * ```tsx
 * <Button variant="ghost" size="icon">
 *   <X className="h-4 w-4" />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </Button>
 * ```
 */
const VisuallyHidden = forwardRef<
  ComponentRef<typeof VisuallyHiddenPrimitive.Root>,
  ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>
>(({ ...props }, ref) => (
  <VisuallyHiddenPrimitive.Root
    ref={ref}
    data-slot="visually-hidden"
    {...props}
  />
));
VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
