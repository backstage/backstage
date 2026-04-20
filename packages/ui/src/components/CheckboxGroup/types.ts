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

import type { CheckboxGroupProps as RACheckboxGroupProps } from 'react-aria-components';
import type { ReactNode } from 'react';
import type { FieldLabelProps } from '../FieldLabel/types';

/**
 * Own props for the CheckboxGroup component.
 * @public
 */
export type CheckboxGroupOwnProps = {
  className?: string;
  children?: ReactNode;
  label?: FieldLabelProps['label'];
  secondaryLabel?: FieldLabelProps['secondaryLabel'];
  description?: FieldLabelProps['description'];
  isRequired?: RACheckboxGroupProps['isRequired'];
  orientation?: 'horizontal' | 'vertical';
};

/**
 * Props for the CheckboxGroup component.
 * @public
 */
export interface CheckboxGroupProps
  extends Omit<RACheckboxGroupProps, keyof CheckboxGroupOwnProps>,
    CheckboxGroupOwnProps {}
