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

import React, { forwardRef, useState } from 'react';
import { Slider as SliderPrimitive } from '@base-ui-components/react/slider';
import { SliderProps } from './types';

/** @public */
export const Slider = forwardRef<HTMLDivElement, SliderProps>((props, ref) => {
  const {
    labelPlacement = 'end',
    defaultValue = 25,
    orientation = 'horizontal',
    size = 'medium',
    label,
    name,
    min = 0,
    max = 100,
    step = 1,
    format,
    value,
    className,
    disabled = false,
    largeStep = 10,
    onValueChange,
    onValueCommitted,
    valueLabelDisplay = 'auto',
    minStepsBetweenValues,
  } = props;

  const [currentValue, setCurrentValue] = useState(value || defaultValue);

  const handleValueChange = (value: number | number[], event: Event) => {
    setCurrentValue(value);
    if (onValueChange) {
      onValueChange(value, event, 0);
    }
  };

  const sliderElement = (
    <SliderPrimitive.Root
      ref={ref}
      name={name}
      min={min}
      max={max}
      step={step}
      format={format}
      value={value}
      disabled={disabled}
      orientation={orientation}
      largeStep={largeStep}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      onValueCommitted={onValueCommitted}
      minStepsBetweenValues={minStepsBetweenValues}
      className={['cn-slider', `cn-slider-${size}`, className].join(' ')}
    >
      <SliderPrimitive.Control className="cn-slider-control">
        <SliderPrimitive.Track className="cn-slider-track">
          <SliderPrimitive.Indicator className="cn-slider-indicator" />
          <SliderPrimitive.Thumb
            className="cn-slider-thumb"
            getAriaLabel={value => value.toString()}
            data-valueLabelDisplay={valueLabelDisplay}
          >
            <span className="cn-slider-valueLabel">{currentValue}</span>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );

  return label ? (
    <label
      className={['cn-slider-label', `cn-slider-label-${labelPlacement}`].join(
        ' ',
      )}
    >
      {sliderElement}
      {label}
    </label>
  ) : (
    sliderElement
  );
});
export default Slider;
