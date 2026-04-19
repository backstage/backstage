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
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/**
 * Tailwind CSS class variant definitions for the Button component using
 * class-variance-authority (cva).
 *
 * @remarks
 * Provides 6 visual variants (default, destructive, outline, secondary, ghost,
 * link) and 4 size presets (default, sm, lg, icon). The `icon` size is designed
 * to replace the separate MUI `IconButton` component — use
 * `variant="ghost" size="icon"` for icon-only buttons.
 *
 * Base classes include:
 * - Inline-flex centering with gap for icon + text composition
 * - Focus-visible ring for keyboard accessibility
 * - Disabled state with pointer-events-none and reduced opacity
 * - SVG child sizing normalization for consistent icon rendering
 *
 * @example
 * ```tsx
 * // Use buttonVariants to extract classes without rendering the component
 * <div className={buttonVariants({ variant: 'outline', size: 'sm' })} />
 * ```
 *
 * @public
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-[0.98]',
        ghost: 'hover:bg-accent/80 hover:text-accent-foreground',
        link: 'text-primary underline underline-offset-4 hover:text-primary/80',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

/**
 * Properties for the {@link Button} component.
 *
 * @remarks
 * Extends native HTML button attributes with shadcn/ui variant and size props
 * derived from the {@link buttonVariants} cva definition. Includes the `asChild`
 * prop for Radix UI Slot-based render delegation, enabling composition with
 * React Router `Link` or native `<a>` elements.
 *
 * @example
 * ```tsx
 * // Standard usage
 * <Button variant="destructive" size="sm" onClick={handleDelete}>
 *   Delete
 * </Button>
 *
 * // asChild with React Router Link
 * <Button asChild variant="outline">
 *   <Link to="/settings">Settings</Link>
 * </Button>
 *
 * // Icon button (replaces MUI IconButton)
 * <Button variant="ghost" size="icon" aria-label="Close">
 *   <XIcon />
 * </Button>
 * ```
 *
 * @public
 */
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * When true, the Button delegates rendering to its single child element
   * via Radix UI Slot, merging all button props (className, event handlers,
   * ref, aria attributes, etc.) onto that child instead of rendering a native
   * `<button>` element.
   *
   * @remarks
   * This is essential for composing button styles with navigation elements:
   * `<Button asChild><Link to="/path">Navigate</Link></Button>` replaces
   * the previous MUI `LinkButton` pattern.
   *
   * @defaultValue false
   */
  asChild?: boolean;
}

/**
 * A versatile, accessible button component following shadcn/ui new-york style
 * conventions. Built on Radix UI Slot primitive for render delegation via
 * `asChild`.
 *
 * @remarks
 * This component replaces both MUI `Button` and MUI `IconButton` with a single
 * unified API:
 *
 * - **6 visual variants:** default, destructive, outline, secondary, ghost, link
 * - **4 size presets:** default (h-9), sm (h-8), lg (h-10), icon (h-9 w-9)
 * - **Render delegation:** `asChild` prop merges button styles onto child element
 * - **Accessibility:** Focus-visible ring, disabled state handling, proper ARIA
 * - **Icon support:** SVG children are automatically sized to 1rem (16px)
 *
 * Uses `React.forwardRef` to allow parent components to access the underlying
 * DOM element. Applies `data-slot="button"` for CSS targeting and debugging.
 *
 * @example
 * ```tsx
 * // Primary action button
 * <Button variant="default">Save Changes</Button>
 *
 * // Destructive action
 * <Button variant="destructive">Delete Item</Button>
 *
 * // Outline button
 * <Button variant="outline" size="sm">Cancel</Button>
 *
 * // Ghost icon button (replaces MUI IconButton)
 * <Button variant="ghost" size="icon" aria-label="Search">
 *   <SearchIcon />
 * </Button>
 *
 * // Link-style button
 * <Button variant="link">Learn More</Button>
 *
 * // Composed with React Router Link via asChild
 * <Button asChild variant="outline">
 *   <Link to="/dashboard">Go to Dashboard</Link>
 * </Button>
 * ```
 *
 * @public
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        data-slot="button"
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

/**
 * Union type of valid button variant names.
 * @public
 */
type ButtonVariant = NonNullable<ButtonProps['variant']>;

/**
 * Union type of valid button size names.
 * @public
 */
type ButtonSize = NonNullable<ButtonProps['size']>;

export { Button, buttonVariants };
export type { ButtonProps, ButtonVariant, ButtonSize };
