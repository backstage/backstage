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
import type { SliderProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { SliderDefinition } from './definition';
import styles from './Slider.module.css';

function SliderImpl<T extends number | number[]>(
  props: SliderProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    label,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    description,
    secondaryLabel,
    defaultValue,
    value,
    ...restProps
  } = props;

  const isRequired = (props as any).isRequired;

  useEffect(() => {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        'Slider requires either a visible label, aria-label, or aria-labelledby for accessibility',
      );
    }
  }, [label, ariaLabel, ariaLabelledBy]);

  const {
    ownProps,
    restProps: definitionRest,
    dataAttributes,
  } = useDefinition(SliderDefinition, restProps);
  const { classes, className } = ownProps;

  const secondaryLabelText = secondaryLabel || (isRequired ? 'Required' : null);

  // Determine if this is a range slider (array value) or single value
  const isRange = Array.isArray(defaultValue) || Array.isArray(value);

  return (
    <AriaSlider
      className={clsx(classes.root, styles[classes.root], className)}
      {...dataAttributes}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      defaultValue={defaultValue}
      value={value}
      {...definitionRest}
      ref={ref}
    >
      {label && (
        <div className={clsx(classes.header, styles[classes.header])}>
          <FieldLabel
            label={label}
            secondaryLabel={secondaryLabelText}
            description={description}
          />
          <SliderOutput
            className={clsx(classes.output, styles[classes.output])}
          >
            {({ state }) =>
              state.values
                .map((_, i) => state.getThumbValueLabel(i))
                .join(' – ')
            }
          </SliderOutput>
        </div>
      )}
      <SliderTrack className={clsx(classes.track, styles[classes.track])}>
        {({ state }) => (
          <>
            {(() => {
              const numThumbs = state.values.length;

              // Calculate track fill
              let trackFillStyle: React.CSSProperties;
              if (numThumbs === 1) {
                // Single thumb: fill from start to thumb
                const percent = state.getThumbPercent(0);
                const isVertical = state.orientation === 'vertical';
                trackFillStyle = isVertical
                  ? { bottom: 0, height: `${percent * 100}%` }
                  : { left: 0, width: `${percent * 100}%` };
              } else {
                // Range: fill between thumbs
                const start = state.getThumbPercent(0);
                const end = state.getThumbPercent(1);
                const rangePercent = (end - start) * 100;
                const isVertical = state.orientation === 'vertical';
                trackFillStyle = isVertical
                  ? { bottom: `${start * 100}%`, height: `${rangePercent}%` }
                  : { left: `${start * 100}%`, width: `${rangePercent}%` };
              }

              return (
                <div
                  className={clsx(classes.trackFill, styles[classes.trackFill])}
                  style={trackFillStyle}
                />
              );
            })()}
            <SliderThumb
              index={0}
              className={clsx(classes.thumb, styles[classes.thumb])}
            />
            {isRange && (
              <SliderThumb
                index={1}
                className={clsx(classes.thumb, styles[classes.thumb])}
              />
            )}
          </>
        )}
      </SliderTrack>
      <FieldError />
    </AriaSlider>
  );
}

/** @public */
export const Slider = forwardRef(SliderImpl) as <T extends number | number[]>(
  props: SliderProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof SliderImpl>;

(Slider as any).displayName = 'Slider';
