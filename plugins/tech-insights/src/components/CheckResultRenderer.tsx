/*
 * Copyright 2020 The Backstage Authors
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

import { CheckResult } from '@backstage/plugin-tech-insights-common';
import React from 'react';
import { BooleanCheck } from './BooleanCheck';

/**
 * Defines a react component that is responsible for rendering a results of a given type.
 *
 * @public
 */
export type CheckResultRenderer = {
  type: string;
  title: string;
  description: string;
  component: React.ReactElement;
};

export function defaultCheckResultRenderers(
  value: CheckResult[],
  title?: string,
  description?: string,
): CheckResultRenderer[] {
  return [
    {
      type: 'json-rules-engine',
      title: title || 'Boolean scorecard',
      description:
        description ||
        'This card represents an overview of default boolean Backstage checks:',
      component: <BooleanCheck checkResult={value} />,
    },
  ];
}
