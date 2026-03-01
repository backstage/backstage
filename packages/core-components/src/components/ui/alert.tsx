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

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

/**
 * Alert variant types.
 * @public
 */
export type AlertVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

/** Returns Tailwind classes for the given alert variant. */
function getVariantClasses(variant: AlertVariant = 'default'): string {
  const variants: Record<AlertVariant, string> = {
    default: 'bg-background text-foreground',
    destructive:
      'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    warning:
      'border-warning/50 text-warning-foreground bg-warning/10 [&>svg]:text-warning',
    success:
      'border-success/50 text-success-foreground bg-success/10 [&>svg]:text-success',
    info:
      'border-info/50 text-info-foreground bg-info/10 [&>svg]:text-info',
  };
  return variants[variant];
}

/**
 * Properties for the Alert component.
 * @public
 */
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant of the alert */
  variant?: AlertVariant;
}

/**
 * Alert component following shadcn/ui conventions.
 * Replaces MUI Alert/Lab Alert with a Tailwind-styled alert supporting
 * default, destructive, warning, success, and info variants.
 *
 * @public
 * @example
 * ```tsx
 * <Alert variant="destructive">
 *   <AlertTitle>Error</AlertTitle>
 *   <AlertDescription>Something went wrong.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      data-slot="alert"
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7',
        getVariantClasses(variant),
        className,
      )}
      {...props}
    />
  ),
);
Alert.displayName = 'Alert';

/**
 * Title element for Alert content.
 * @public
 */
const AlertTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
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
 * Description text for Alert content.
 * @public
 */
const AlertDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="alert-description"
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
