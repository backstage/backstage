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
import { Radio as RadioPrimitive } from '@base-ui-components/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui-components/react/radio-group';

import { useCanon } from '../../contexts/canon';
import { RadioProps } from './types';

/** @public */
export const Radio = forwardRef<HTMLDivElement, RadioProps>(
  (props: RadioProps, ref) => {
    const {
      size = 'medium',
      color = 'primary',
      name,
      value,
      options,
      disabled,
      required,
      readOnly,
      groupLabel,
      direction = 'column',
      optionsLabelPlacement = 'end',
      onValueChange,
      defaultValue,
      className,
    } = props;

    const { getResponsiveValue } = useCanon();

    // Get the responsive value for the variant
    const responsiveSize = getResponsiveValue(size);

    return (
      <RadioGroupPrimitive
        ref={ref}
        name={name}
        value={value}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        data-direction={direction}
        className={[
          'cn-radio-group',
          `cn-radio-${responsiveSize}`,
          `cn-radio-color-${color}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {groupLabel && <div className="cn-radio-caption">{groupLabel}</div>}

        {options.map(option => (
          <label
            key={option}
            className="cn-radio-item"
            data-label-placement={optionsLabelPlacement}
          >
            <RadioPrimitive.Root value={option} className="cn-radio">
              <RadioPrimitive.Indicator className="cn-radio-indicator" />
            </RadioPrimitive.Root>
            {option}
          </label>
        ))}
      </RadioGroupPrimitive>
    );
  },
);

export default Radio;
