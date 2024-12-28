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

/**
 * Properties for {@link Slider}
 *
 * @public
 */
export interface SliderProps {
  /**
   * The label of the slider.
   */
  label?: string;
  /**
   * Additional classes to be added to the root element.
   */
  className?: string;
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: number | ReadonlyArray<number>;
  /**
   * Whether the component should ignore user interaction.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * The maximum allowed value of the slider.
   * Should not be equal to min.
   * @defaultValue 100
   */
  max?: number;
  /**
   * The minimum allowed value of the slider.
   * Should not be equal to max.
   * @defaultValue 0
   */
  min?: number;
  /**
   * The minimum steps between values in a range slider.
   * @defaultValue 0
   */
  minStepsBetweenValues?: number;
  /**
   * The adjustable size of the slider.
   * @defaultValue 'medium'
   */
  size?: 'small' | 'medium';
  /**
   * The placement of the label.
   * @defaultValue 'end'
   */
  labelPlacement?: 'start' | 'end' | 'bottom';
  /**
   * When the value label should be displayed.
   * @defaultValue 'auto'
   */
  valueLabelDisplay?: 'on' | 'off' | 'auto';
  /**
   * The component orientation.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The ref attached to the root of the Slider.
   */
  rootRef?: React.Ref<Element>;
  /**
   * The granularity with which the slider can step through values when using Page Up/Page Down or Shift + Arrow Up/Arrow Down.
   * @defaultValue 10
   */
  largeStep?: number;
  /**
   * The granularity with which the slider can step through values. (A "discrete" slider.)
   * The `min` prop serves as the origin for the valid values.
   * We recommend (max - min) to be evenly divisible by the step.
   * @defaultValue 1
   */
  step?: number;
  /**
   * Tab index attribute of the Thumb component's `input` element.
   */
  tabIndex?: number;
  /**
   * The value of the slider.
   * For ranged sliders, provide an array with two values.
   */
  value?: number | ReadonlyArray<number>;
  /**
   * Callback function that is fired when the slider's value changed.
   *
   * @param value - The new value.
   * @param event - The corresponding event that initiated the change.
   * @param activeThumbIndex - Index of the currently moved thumb.
   */
  onValueChange?: (
    value: number | number[],
    event: Event,
    activeThumbIndex: number,
  ) => void;
  /**
   * Callback function that is fired when the `pointerup` is triggered.
   *
   * @param value - The new value.
   * @param event - The corresponding event that initiated the change.
   * **Warning**: This is a generic event not a change event.
   */
  onValueCommitted?: (value: number | number[], event: Event) => void;
}
