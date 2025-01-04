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
import { Switch as SwitchPrimitive } from '@base-ui-components/react/switch';

import { useCanon } from '../../contexts/canon';
import { SwitchProps } from './types';
import { Icon } from '../Icon';

/** @public */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (props, ref) => {
    const {
      size = 'medium',
      disabled = false,
      required = false,
      readOnly = false,
      defaultChecked = false,
      labelPlacement = 'right',
      name,
      value,
      label,
      style,
      checked,
      iconEnd,
      className,
      iconStart,
      onCheckedChange,
    } = props;

    const { getResponsiveValue } = useCanon();

    // Get the responsive value for the variant
    const responsiveSize = getResponsiveValue(size);

    const switchElement = (
      <SwitchPrimitive.Root
        {...props}
        ref={ref}
        name={name}
        value={value}
        style={style}
        checked={checked}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        className={['cn-switch', `cn-switch-${responsiveSize}`, className].join(
          ' ',
        )}
      >
        <SwitchPrimitive.Thumb
          className="cn-switch-thumb"
          render={(props, state) => {
            if (state.checked) {
              return (
                <span {...props} style={{ pointerEvents: 'none' }}>
                  {iconStart && <Icon name={iconStart} />}
                </span>
              );
            }

            return (
              <span {...props} style={{ pointerEvents: 'none' }}>
                {iconEnd && <Icon name={iconEnd} />}
              </span>
            );
          }}
        />
      </SwitchPrimitive.Root>
    );

    return label ? (
      <label
        className={[
          'cn-switch-label',
          `cn-switch-label-${labelPlacement}`,
        ].join(' ')}
      >
        {switchElement}
        {label}
      </label>
    ) : (
      switchElement
    );
  },
);
export default Switch;
