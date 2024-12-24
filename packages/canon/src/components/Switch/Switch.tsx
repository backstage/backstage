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
import { SwitchProps } from './types';
import { Switch as SwitchPrimitive } from '@base-ui-components/react/switch';

/** @public */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
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

    const switchElement = (
      <SwitchPrimitive.Root
        ref={ref}
        className={`switch ${className}`}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        required={required}
        name={name}
        value={value}
        style={style}
      >
        <SwitchPrimitive.Thumb className="switch-thumb" />
      </SwitchPrimitive.Root>
    );

    return label ? (
      <label className="switch-label">
        {switchElement}
        {label}
      </label>
    ) : (
      switchElement
    );
  },
);
