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
import React, { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { type ParsedTemplateSchema } from './useTemplateSchema';
import { useTransformSchemaToProps } from './useTransformSchemaToProps';

describe('useTransformSchemaToProps', () => {
  it('should replace ui:ObjectFieldTemplate with actual component', () => {
    const layouts = [{ name: 'TwoColumn', component: jest.fn() }];

    const step: ParsedTemplateSchema = {
      title: 'Fill in some steps',
      mergedSchema: {},
      schema: {},
      uiSchema: {
        'ui:ObjectFieldTemplate': 'TwoColumn' as any,
        name: {
          'ui:field': 'EntityNamePicker',
          'ui:autofocus': true,
        },
      },
    };

    const { result } = renderHook(
      () => useTransformSchemaToProps(step, { layouts }),
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <TestApiProvider apis={[]}>{children}</TestApiProvider>
        ),
      },
    );

    const { uiSchema } = result.current;

    expect(uiSchema['ui:ObjectFieldTemplate']).toEqual(layouts[0].component);
  });
});
