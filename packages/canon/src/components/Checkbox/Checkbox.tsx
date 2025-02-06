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

import { Checkbox as CheckboxPrimitive } from '@base-ui-components/react/checkbox';
import { Icon } from '@backstage/canon';
import type { CheckboxProps } from './types';
import clsx from 'clsx';

/** @public */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (props, ref) => {
    const {
      label,
      checked,
      onChange,
      disabled,
      required,
      className,
      name,
      value,
      style,
    } = props;

    const checkboxElement = (
      <CheckboxPrimitive.Root
        ref={ref}
        className={clsx('canon-CheckboxRoot', className)}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        style={style}
      >
        <CheckboxPrimitive.Indicator className="canon-CheckboxIndicator">
          <Icon name="check" size={12} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    return label ? (
      <label className="canon-CheckboxLabel">
        {checkboxElement}
        {label}
      </label>
    ) : (
      checkboxElement
    );
  },
);
