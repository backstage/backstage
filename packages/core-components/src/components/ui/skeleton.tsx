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
import { cn } from '../../lib/utils';

/**
 * A skeleton placeholder component that displays a pulsing animation to
 * indicate content is loading. Used in DataTable loading states, lazy-loaded
 * content areas, and anywhere a visual placeholder is needed while data is
 * being fetched.
 *
 * @remarks
 * Built following shadcn/ui new-york style conventions. Renders a plain
 * `<div>` element with Tailwind CSS `animate-pulse` for the loading
 * animation, `rounded-md` for consistent border radius, and
 * `bg-primary/10` for a subtle tinted background that adapts to the
 * current theme's primary color.
 *
 * The component accepts all standard HTML div attributes, allowing
 * consumers to control dimensions via `className` or inline `style`.
 *
 * @example
 * ```tsx
 * // Basic skeleton line
 * <Skeleton className="h-4 w-[250px]" />
 *
 * // Skeleton circle (avatar placeholder)
 * <Skeleton className="h-12 w-12 rounded-full" />
 *
 * // Skeleton card layout
 * <div className="flex items-center space-x-4">
 *   <Skeleton className="h-12 w-12 rounded-full" />
 *   <div className="space-y-2">
 *     <Skeleton className="h-4 w-[250px]" />
 *     <Skeleton className="h-4 w-[200px]" />
 *   </div>
 * </div>
 * ```
 *
 * @param props - Standard HTML div attributes including className for sizing
 * @public
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-primary/10', className)}
      {...props}
    />
  );
}

export { Skeleton };
