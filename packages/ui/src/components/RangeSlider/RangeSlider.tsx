/*
 * Copyright 2026 The Backstage Authors
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

import { forwardRef, useEffect } from 'react';
import {
  Slider as AriaSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
} from 'react-aria-components';
import clsx from 'clsx';
import { FieldLabel } from '../FieldLabel';
import { FieldError } from '../FieldError';
import type { RangeSliderProps } from './types';
import { useStyles } from '../../hooks/useStyles';
import { RangeSliderDefinition } from './definition';
import styles from './RangeSlider.module.css';

/** @public */
export const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (props, ref) => {
    const {
      label,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
    } = props;

    useEffect(() => {
      if (!label && !ariaLabel && !ariaLabelledBy) {
        console.warn(
          'RangeSlider requires either a visible label, aria-label, or aria-labelledby for accessibility',
        );
      }
    }, [label, ariaLabel, ariaLabelledBy]);

    useEffect(() => {
      const valueArray = props.value ?? props.defaultValue;
      if (valueArray && valueArray.length !== 2) {
        console.warn(
          `RangeSlider requires exactly 2 values [min, max], but received ${valueArray.length} values`,
        );
      }
    }, [props.value, props.defaultValue]);

    const minValue = props.minValue ?? 0;
    const maxValue = props.maxValue ?? 100;
    const {
      defaultValue = [minValue, maxValue] as [number, number],
      ...propsWithoutDefault
    } = props;

    const { classNames, dataAttributes, style, cleanedProps } = useStyles(
      RangeSliderDefinition,
      {
        minValue,
        maxValue,
        step: 1,
        defaultValue,
        ...propsWithoutDefault,
      },
    );

    const {
      className,
      description,
      secondaryLabel,
      isRequired,
      showValueLabel = false,
      formatValue = (val: number) => val.toString(),
      ...rest
    } = cleanedProps;

    // If a secondary label is provided, use it. Otherwise, use 'Required' if the field is required.
    const secondaryLabelText =
      secondaryLabel || (isRequired ? 'Required' : null);

    return (
      <AriaSlider
        className={clsx(classNames.root, styles[classNames.root], className)}
        {...dataAttributes}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        style={style}
        {...rest}
        ref={ref}
      >
        <div className={styles['bui-RangeSliderHeader']}>
          <FieldLabel
            label={label}
            secondaryLabel={secondaryLabelText}
            description={description}
          />
          {showValueLabel && (
            <SliderOutput
              className={clsx(classNames.output, styles[classNames.output])}
            >
              {({ state }) => {
                const values = state.values;
                if (values.length === 2) {
                  return `${formatValue(values[0])} - ${formatValue(
                    values[1],
                  )}`;
                }
                return formatValue(values[0]);
              }}
            </SliderOutput>
          )}
        </div>
        <SliderTrack
          className={clsx(classNames.track, styles[classNames.track])}
        >
          {({ state }) => {
            const start = state.getThumbPercent(0);
            const end = state.getThumbPercent(1);
            const rangePercent = (end - start) * 100;
            const isVertical = state.orientation === 'vertical';
            const trackFillStyle = isVertical
              ? {
                  bottom: `${start * 100}%`,
                  height: `${rangePercent}%`,
                }
              : {
                  left: `${start * 100}%`,
                  width: `${rangePercent}%`,
                };
            return (
              <>
                <div
                  className={clsx(
                    classNames.trackFill,
                    styles[classNames.trackFill],
                  )}
                  style={trackFillStyle}
                />
                <SliderThumb
                  index={0}
                  className={clsx(classNames.thumb, styles[classNames.thumb])}
                />
                <SliderThumb
                  index={1}
                  className={clsx(classNames.thumb, styles[classNames.thumb])}
                />
              </>
            );
          }}
        </SliderTrack>
        <FieldError />
      </AriaSlider>
    );
  },
);

RangeSlider.displayName = 'RangeSlider';
