/*
 * Copyright 2023 The Backstage Authors
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
import { useMemo } from 'react';
import { LayoutOptions } from '../../layouts';
import { type ParsedTemplateSchema } from './useTemplateSchema';

interface Options {
  layouts?: LayoutOptions[];
}

export const useTransformSchemaToProps = (
  step: ParsedTemplateSchema,
  options: Options = {},
): ParsedTemplateSchema => {
  const { layouts = [] } = options;
  const objectFieldTemplate = step?.uiSchema['ui:ObjectFieldTemplate'] as
    | string
    | undefined;
  return useMemo(() => {
    if (typeof objectFieldTemplate !== 'string') {
      return step;
    }

    const Layout = layouts.find(
      layout => layout.name === objectFieldTemplate,
    )?.component;

    if (!Layout) {
      return step;
    }
    return {
      ...step,
      uiSchema: {
        ...step.uiSchema,
        ['ui:ObjectFieldTemplate']: Layout,
      },
    };
  }, [layouts, objectFieldTemplate, step]);
};
