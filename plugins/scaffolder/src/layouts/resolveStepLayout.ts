/*
 * Copyright 2022 The Backstage Authors
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

import { UiSchema } from '@rjsf/core';
import { DefaultStepFormLayout } from '../components/layouts/DefaultStepFormLayout';
import { DEFAULT_SCAFFOLDER_LAYOUT } from './default';
import { LayoutOptions, LayoutTemplate } from './types';

export function resolveStepLayout(
  uiSchema: UiSchema = {},
  layouts: LayoutOptions[],
): LayoutTemplate {
  const layoutName = uiSchema?.['ui:layout'] ?? DEFAULT_SCAFFOLDER_LAYOUT.name;

  delete uiSchema?.['ui:layout'];

  const LayoutComponent = layouts.find(
    layout => layout.name === layoutName,
  )?.component;

  if (!LayoutComponent) {
    return DefaultStepFormLayout;
  }

  return LayoutComponent;
}
