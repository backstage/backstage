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

import { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * Badge variant types following shadcn/ui conventions with Backstage-specific
 * status variants (success, warning, info).
 * @public
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info';

/**
 * Returns the Tailwind CSS classes for a given badge variant.
 *
 * @param variant - The visual variant of the badge
 * @returns A string of Tailwind CSS utility classes
 */
function getVariantClasses(variant: BadgeVariant = 'default'): string {
  const variants: Record<BadgeVariant, string> = {
    default:
      'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
    secondary:
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
    outline: 'text-foreground',
    success: 'border-transparent bg-success text-success-foreground',
    warning: 'border-transparent bg-warning text-warning-foreground',
    info: 'border-transparent bg-info text-info-foreground',
  };
  return variants[variant];
}

/**
 * Properties for the Badge component.
 *
 * @public
 * @remarks
 * Extends native HTMLDivElement attributes. The Badge replaces MUI Chip
 * throughout the Backstage catalog for entity labels, tags, and lifecycle
 * indicators. Includes 7 variants: default, secondary, destructive, outline,
 * plus Backstage-specific success, warning, and info for status displays.
 */
export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the badge */
  variant?: BadgeVariant;
}

/**
 * A lightweight badge component following shadcn/ui conventions.
 * Replaces MUI Chip with a Tailwind CSS-styled badge supporting 7 variants.
 *
 * @public
 * @remarks
 * Used for entity labels, tags, lifecycle indicators (Alpha/Beta), and
 * status displays throughout the Backstage catalog. Supports default,
 * secondary, destructive, outline, success, warning, and info variants.
 *
 * @example
 * ```tsx
 * <Badge variant="default">Label</Badge>
 * <Badge variant="success">Healthy</Badge>
 * <Badge variant="warning">Degraded</Badge>
 * ```
 */
export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        getVariantClasses(variant),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Generates the combined Tailwind classes for a given badge variant.
 * Useful when consuming components need badge-like styling without
 * rendering the Badge component itself.
 *
 * @param variant - The visual variant
 * @returns Combined Tailwind CSS class string
 * @public
 */
export function badgeVariants(variant: BadgeVariant = 'default'): string {
  return cn(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    getVariantClasses(variant),
  );
}
