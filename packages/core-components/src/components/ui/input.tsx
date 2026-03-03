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
 * A lightweight, Tailwind-styled input field component built as a shadcn/ui
 * primitive following the new-york style convention.
 *
 * @remarks
 * Replaces MUI {@link https://v4.mui.com/api/text-field/ | TextField},
 * {@link https://v4.mui.com/api/input-base/ | InputBase}, and
 * {@link https://v4.mui.com/api/input-label/ | InputLabel} with a pure HTML
 * `<input>` element styled via Tailwind CSS utility classes. Designed for use
 * in search bars, form fields, and scaffolder inputs throughout the Backstage
 * developer portal.
 *
 * Features:
 * - Full HTML input attribute support via `React.InputHTMLAttributes`
 * - Ref forwarding for parent component access to the native input element
 * - Accessible focus-visible ring indicator for keyboard navigation
 * - Disabled state with reduced opacity and not-allowed cursor
 * - File input styling with transparent background and foreground text
 * - Placeholder text styled with muted foreground color
 * - Responsive text sizing (base on mobile, sm on md+ breakpoints)
 * - CSS custom property token integration via `border-input`, `ring`,
 *   `foreground`, and `muted-foreground` design tokens
 * - Class name composition via `cn()` for conflict-free Tailwind merging
 *
 * @example
 * ```tsx
 * import { Input } from '../components/ui/input';
 *
 * // Basic text input
 * <Input type="text" placeholder="Enter your name" />
 *
 * // With ref forwarding
 * const inputRef = React.useRef<HTMLInputElement>(null);
 * <Input ref={inputRef} type="email" placeholder="you@example.com" />
 *
 * // Disabled state
 * <Input disabled placeholder="Cannot edit" />
 *
 * // File input
 * <Input type="file" />
 *
 * // Custom className override (Tailwind merge resolves conflicts)
 * <Input className="h-12 text-lg" placeholder="Large input" />
 * ```
 *
 * @public
 */
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    data-slot="input"
    className={cn(
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm',
      'transition-colors',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'md:text-sm',
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
