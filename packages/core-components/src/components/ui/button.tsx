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

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from 'radix-ui';
import { cn } from '../../lib/utils';

/**
 * Button variant types following shadcn/ui conventions.
 * @public
 */
export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

/**
 * Button size types following shadcn/ui conventions.
 * @public
 */
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Returns the Tailwind CSS classes for a given button variant.
 */
function getVariantClasses(variant: ButtonVariant = 'default'): string {
  const variants: Record<ButtonVariant, string> = {
    default:
      'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
    destructive:
      'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
    outline:
      'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
    secondary:
      'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  return variants[variant];
}

/**
 * Returns the Tailwind CSS classes for a given button size.
 */
function getSizeClasses(size: ButtonSize = 'default'): string {
  const sizes: Record<ButtonSize, string> = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-6',
    icon: 'h-9 w-9',
  };
  return sizes[size];
}

/**
 * Properties for the Button component.
 *
 * @public
 * @remarks
 * See {@link https://ui.shadcn.com/docs/components/button | shadcn/ui Button} for documentation
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size preset for the button */
  size?: ButtonSize;
  /**
   * When true, the Button delegates rendering to its single child element
   * via Radix Slot, merging all button props (classes, event handlers, etc.)
   * onto that child. This enables composing button styles with other elements
   * like anchors or React Router Links.
   */
  asChild?: boolean;
}

/**
 * A versatile button component following shadcn/ui conventions.
 * Built on Radix UI Slot primitive for render delegation via `asChild`.
 *
 * @public
 * @remarks
 * Supports 6 visual variants (default, destructive, outline, secondary, ghost, link)
 * and 4 size presets (default, sm, lg, icon). When `asChild` is true, merges button
 * styles onto the child element using Radix Slot.
 *
 * @example
 * ```tsx
 * // Standard button
 * <Button variant="default">Click me</Button>
 *
 * // Button as a link (render delegation)
 * <Button asChild variant="outline">
 *   <a href="/path">Navigate</a>
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        data-slot="button"
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
          getVariantClasses(variant),
          getSizeClasses(size),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
