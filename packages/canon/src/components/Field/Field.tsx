/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react';
import { Field as FieldPrimitive } from '@base-ui-components/react/field';
import clsx from 'clsx';

const FieldRoot = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof FieldPrimitive.Root>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Root
    ref={ref}
    className={clsx('canon-FieldRoot', className)}
    {...props}
  />
));
FieldRoot.displayName = FieldPrimitive.Root.displayName;

const FieldLabel = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof FieldPrimitive.Label>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Label
    ref={ref}
    className={clsx('canon-FieldLabel', className)}
    {...props}
  />
));
FieldLabel.displayName = FieldPrimitive.Label.displayName;

const FieldDescription = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof FieldPrimitive.Description>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Description
    ref={ref}
    className={clsx('canon-FieldDescription', className)}
    {...props}
  />
));
FieldDescription.displayName = FieldPrimitive.Description.displayName;

const FieldError = React.forwardRef<
  React.ElementRef<typeof FieldPrimitive.Error>,
  React.ComponentPropsWithoutRef<typeof FieldPrimitive.Error>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Error
    ref={ref}
    className={clsx('canon-FieldError', className)}
    {...props}
  />
));
FieldError.displayName = FieldPrimitive.Error.displayName;

const FieldValidity = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof FieldPrimitive.Validity> & {
  className?: string;
}) => (
  <FieldPrimitive.Validity {...props}>
    {validityState => (
      <div className={clsx('canon-FieldValidity', className)}>
        {children(validityState)}
      </div>
    )}
  </FieldPrimitive.Validity>
);

/** @public */
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Validity: FieldValidity,
};
