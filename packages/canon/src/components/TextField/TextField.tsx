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

import React, { forwardRef } from 'react';
import { Field } from '@base-ui-components/react/field';
import { Input } from '@base-ui-components/react/input';
import { useResponsiveValue } from '../../hooks/useResponsiveValue';
import clsx from 'clsx';

import type { TextFieldProps } from './types';

/** @public */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props: TextFieldProps, ref) => {
    const {
      className,
      size = 'medium',
      label,
      description,
      name,
      ...rest
    } = props;

    // Get the responsive value for the variant
    const responsiveSize = useResponsiveValue(size);

    return (
      <Field.Root className={clsx('canon-FieldRoot', className)} name={name}>
        {label && (
          <Field.Label className="canon-FieldLabel">{label}</Field.Label>
        )}
        <Input
          ref={ref}
          type={name}
          className={clsx('canon-Input', `canon-Input--size-${responsiveSize}`)}
          {...rest}
        />
        {description && (
          <Field.Description className="canon-FieldDescription">
            {description}
          </Field.Description>
        )}
        <Field.Error className="canon-FieldError" />
      </Field.Root>
    );
  },
);

TextField.displayName = 'TextField';
