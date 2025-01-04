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

import { IconNames } from '../Icon';
import type { Breakpoint } from '../../types';

/**
 * Properties for {@link Switch}
 *
 * @public
 */
export interface SwitchProps {
  /**
   * The current value of the switch.
   */
  value?: string;
  /**
   * Label to display beside the switch.
   */
  label?: string;
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;
  /**
   * Additional class names to apply to the switch.
   */
  className?: string;
  /**
   * Additional styles to apply to the switch.
   */
  style?: React.CSSProperties;
  /**
   * Whether the switch is currently active.
   *
   * To render an uncontrolled switch, use the `defaultChecked` prop instead.
   */
  checked?: boolean;
  /**
   * Whether the switch is initially active.
   *
   * To render a controlled switch, use the `checked` prop instead.
   * @defaultValue false
   */
  defaultChecked?: boolean;
  /**
   * Whether the component should ignore user interaction.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the user should be unable to activate or deactivate the switch.
   * @defaultValue false
   */
  readOnly?: boolean;
  /**
   * Whether the user must activate the switch before submitting a form.
   * @defaultValue false
   */
  required?: boolean;
  /**
   * Where to place the label in relation to the switch.
   * @defaultValue 'start'
   */
  labelPlacement?: 'top' | 'bottom' | 'start' | 'end';
  /**
   * Event handler called when the switch is activated or deactivated.
   */
  onCheckedChange?: (checked: boolean, event: Event) => void;
  /**
   * Icon of the switch when checked
   */
  iconStart?: IconNames;
  /**
   * Icon of the switch when unchecked
   */
  iconEnd?: IconNames;
  /**
   * Responsive sizes for the switch.
   */
  size?:
    | 'extra-small'
    | 'small'
    | 'medium'
    | 'large'
    | Partial<Record<Breakpoint, 'xsmall' | 'small' | 'medium' | 'large'>>;
}
