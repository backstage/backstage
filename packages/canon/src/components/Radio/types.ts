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
import type { Breakpoint } from '../../types';

/**
 * Properties for {@link Radio}
 *
 * @public
 */
export interface RadioProps {
  /**
   * Identifies the field when a form is submitted.
   */
  name: string;
  /**
   * The Radio optoins to render as radio buttons for the user to select from.
   */
  options: string[];
  /**
   * The uncontrolled value of the radio button that should be initially selected.
   *
   * To render a controlled radio group, use the `value` prop instead.
   */
  defaultValue?: string;
  /**
   * The controlled value of the radio item that should be currently selected.
   *
   * To render an uncontrolled radio group, use the `defaultValue` prop instead.
   */
  value?: string;
  /**
   * The Label placement for the radio options in the group.
   * @default 'end'
   */
  optionsLabelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  /**
   * The label for the radio group that is displayed above the radio buttons.
   */
  groupLabel?: string;
  /**
   * The size of the radio buttons. Responsive values can be provided for different breakpoints.
   * @default 'medium'
   */
  size?:
    | 'small'
    | 'medium'
    | 'large'
    | Partial<Record<Breakpoint, 'small' | 'medium' | 'large'>>;
  /**
   * The color of the radio buttons.
   * @default 'primary'
   */
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'error'
    | 'warning'
    | 'success'
    | 'info'
    | 'neutral';
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the user should be unable to select a different radio button in the group.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the user must choose a value before submitting a form.
   * @default false
   */
  required?: boolean;
  /**
   * Layout direction of the radio options.
   * @default 'column'
   */
  direction?: 'row' | 'column';
  /**
   * Additional classes to apply to the radio group.
   */
  className?: string;
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: unknown, event: Event) => void;
}
