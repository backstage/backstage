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

import React, { ElementRef, forwardRef } from 'react';
import { Input as InputPrimitive } from '@base-ui-components/react/input';
import clsx from 'clsx';
import type { InputProps } from './types';

/** @public */
const Input = forwardRef<ElementRef<typeof InputPrimitive>, InputProps>(
  (props, ref) => {
    const { size = 'md', className, ...rest } = props;

    return (
      <InputPrimitive
        ref={ref}
        className={clsx(
          'canon-Input',
          size === 'sm' ? 'canon-Input--size-sm' : 'canon-Input--size-md',
          className,
        )}
        {...rest}
      />
    );
  },
);

Input.displayName = InputPrimitive.displayName;

export { Input };
