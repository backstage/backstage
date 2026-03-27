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
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

/**
 * Class Variance Authority definition for Badge variant styles.
 *
 * Provides a type-safe variant system that generates Tailwind CSS class strings
 * for 7 Badge variants: default, secondary, destructive, outline, plus
 * Backstage-specific success, warning, and info variants for status displays.
 *
 * @remarks
 * The base classes establish the badge's inline-flex layout, rounded-md shape,
 * border, padding, text sizing, font weight, color transitions, and focus ring
 * styling. Each variant layer adds the appropriate background, text, border,
 * and hover colors using CSS custom property tokens.
 *
 * Backstage-specific variants (success, warning, info) support catalog health
 * indicators, lifecycle status badges, and CI/CD status displays throughout
 * the developer portal.
 *
 * @example
 * ```tsx
 * // Use badgeVariants directly for styling without the Badge component
 * <div className={badgeVariants({ variant: "success" })}>Healthy</div>
 *
 * // Merge with additional classes using cn()
 * <div className={cn(badgeVariants({ variant: "warning" }), "ml-2")}>Degraded</div>
 * ```
 *
 * @public
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
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
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

/**
 * Properties for the {@link Badge} component.
 *
 * @remarks
 * Extends native `HTMLDivElement` attributes with type-safe variant props
 * extracted from the {@link badgeVariants} cva definition. The Badge replaces
 * MUI Chip throughout the Backstage catalog for entity labels, tags, and
 * lifecycle indicators.
 *
 * Supported variants:
 * - `default` — Primary background with shadow
 * - `secondary` — Secondary/muted background
 * - `destructive` — Error/danger state with shadow
 * - `outline` — Border-only with foreground text
 * - `success` — Healthy/passing status (Backstage-specific)
 * - `warning` — Degraded/attention status (Backstage-specific)
 * - `info` — Informational status (Backstage-specific)
 *
 * @public
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * A lightweight badge component following shadcn/ui new-york style conventions.
 *
 * Replaces MUI Chip with a Tailwind CSS-styled badge built on
 * class-variance-authority for type-safe variant management. Supports 7
 * variants including Backstage-specific success, warning, and info for
 * status displays across the developer portal.
 *
 * @remarks
 * Used for entity labels, tags, lifecycle indicators (Alpha/Beta), and
 * status displays throughout the Backstage catalog. The component renders
 * a semantic `div` element with a `data-slot="badge"` attribute for
 * styling hooks and test selectors.
 *
 * @example
 * ```tsx
 * import { Badge } from '../components/ui/badge';
 *
 * // Default variant
 * <Badge>Label</Badge>
 *
 * // Status variants for catalog health
 * <Badge variant="success">Healthy</Badge>
 * <Badge variant="warning">Degraded</Badge>
 * <Badge variant="destructive">Failed</Badge>
 *
 * // Outline variant for tags
 * <Badge variant="outline">v1.2.3</Badge>
 *
 * // With custom className override
 * <Badge variant="info" className="ml-2">New</Badge>
 * ```
 *
 * @param props - Badge properties including variant and standard div attributes
 * @returns A styled div element representing the badge
 * @public
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
