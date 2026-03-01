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

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Composes conditional CSS class names using clsx and merges Tailwind CSS
 * classes intelligently using tailwind-merge to prevent style conflicts.
 *
 * @remarks
 * This utility follows the standard shadcn/ui convention for class name
 * composition. It combines clsx's conditional class joining with
 * tailwind-merge's intelligent deduplication of Tailwind utility classes.
 *
 * @example
 * ```tsx
 * import { cn } from '../lib/utils';
 *
 * // Basic usage
 * <div className={cn('px-4 py-2', 'bg-primary')} />
 *
 * // Conditional classes
 * <div className={cn('px-4 py-2', isActive && 'bg-primary text-primary-foreground')} />
 *
 * // With component className prop override
 * <div className={cn('px-4 py-2 bg-muted', className)} />
 *
 * // Tailwind merge resolves conflicts (last wins)
 * cn('px-4', 'px-6') // → 'px-6' (not 'px-4 px-6')
 * cn('text-red-500', 'text-blue-500') // → 'text-blue-500'
 * ```
 *
 * @param inputs - Any number of class values: strings, objects, arrays,
 *                 undefined, null, false (all valid clsx inputs)
 * @returns A single merged class name string with Tailwind conflicts resolved
 * @public
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
