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
 * Type-safe CSS variant system for the Alert component.
 *
 * @remarks
 * Defines 5 visual variants using `class-variance-authority` (cva):
 *
 * - **default** — Neutral alert with standard background and foreground colors.
 * - **destructive** — Error-level alert using the `--destructive` token. Used for
 *   critical failures and validation errors (replaces MUI `severity="error"`).
 * - **warning** — Caution-level alert using the `--warning` token. Used for
 *   degraded states and important notices (replaces MUI `severity="warning"`).
 * - **success** — Positive alert using the `--success` token. Used for
 *   confirmation messages and successful operations (replaces MUI `severity="success"`).
 * - **info** — Informational alert using the `--info` token. Used for
 *   neutral guidance and tips (replaces MUI `severity="info"`).
 *
 * All status variants (`warning`, `success`, `info`) use Backstage-specific
 * CSS custom property tokens defined in `globals.css` rather than Tailwind
 * color utilities, ensuring consistent theming across light and dark modes.
 *
 * Base classes support an optional leading SVG icon that is absolutely
 * positioned within the alert container, with subsequent content indented
 * via `[&>svg~*]:pl-7`.
 *
 * @example
 * ```tsx
 * import { alertVariants } from './alert';
 *
 * // Generate class string for a destructive alert
 * const classes = alertVariants({ variant: 'destructive' });
 * ```
 *
 * @public
 */
const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        warning:
          'border-warning text-warning-foreground bg-warning [&>svg]:text-warning-foreground',
        success:
          'border-success text-success-foreground bg-success [&>svg]:text-success-foreground',
        info: 'border-info text-info-foreground bg-info [&>svg]:text-info-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

/**
 * Accessible alert container component following the shadcn/ui new-york style.
 *
 * @remarks
 * Replaces the MUI Lab `Alert` component with a lightweight, CSS-variant-based
 * alternative built on Tailwind CSS utility classes and CSS custom properties.
 * Supports all five Backstage status levels: default, destructive, warning,
 * success, and info.
 *
 * The component uses `role="alert"` for accessibility, which causes assistive
 * technologies to immediately announce the alert content when it appears in the
 * DOM. It renders as a `<div>` with `data-slot="alert"` for style targeting.
 *
 * An optional leading SVG icon child is automatically positioned absolutely
 * at the top-left corner, with all sibling content indented to avoid overlap.
 *
 * @example
 * ```tsx
 * import { Alert, AlertTitle, AlertDescription } from './alert';
 * import { AlertCircle } from 'lucide-react';
 *
 * <Alert variant="destructive">
 *   <AlertCircle className="h-4 w-4" />
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 *
 * <Alert variant="success">
 *   <AlertTitle>Success</AlertTitle>
 *   <AlertDescription>Operation completed.</AlertDescription>
 * </Alert>
 * ```
 *
 * @public
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    data-slot="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

/**
 * Title element rendered as an `<h5>` inside an Alert.
 *
 * @remarks
 * Provides a concise heading for the alert message. Styled with medium font
 * weight, tight letter-spacing, and no bottom margin line-height to maintain
 * a compact vertical rhythm within the alert container.
 *
 * Uses `data-slot="alert-title"` for targeted styling overrides.
 *
 * @example
 * ```tsx
 * <Alert variant="warning">
 *   <AlertTitle>Heads up!</AlertTitle>
 *   <AlertDescription>This action cannot be undone.</AlertDescription>
 * </Alert>
 * ```
 *
 * @public
 */
const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content -- content provided via children spread through ...props
  <h5
    ref={ref}
    data-slot="alert-title"
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

/**
 * Descriptive body text rendered as a `<div>` inside an Alert.
 *
 * @remarks
 * Provides the detailed message content for the alert. Styled at the small
 * text size with relaxed line-height applied to any nested `<p>` elements
 * for comfortable reading.
 *
 * Uses `data-slot="alert-description"` for targeted styling overrides.
 *
 * @example
 * ```tsx
 * <Alert variant="info">
 *   <AlertTitle>Note</AlertTitle>
 *   <AlertDescription>
 *     <p>This is a multi-paragraph description.</p>
 *     <p>Each paragraph gets relaxed line-height.</p>
 *   </AlertDescription>
 * </Alert>
 * ```
 *
 * @public
 */
const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
