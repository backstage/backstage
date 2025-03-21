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

import React, { PropsWithChildren } from 'react';
import { createPlugin } from '@backstage/core-plugin-api';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { ScaffolderFormFieldsApi, formFieldsApiRef } from '../alpha';
import { useCustomFieldExtensions } from './useCustomFieldExtensions';
import {
  ScaffolderFieldExtensions,
  createScaffolderFieldExtension,
} from '../extensions';

const plugin = createPlugin({
  id: 'scaffolder',
  apis: [],
  routes: {},
  externalRoutes: {},
});

describe('useCustomFieldExtensions', () => {
  const mockFormFieldsApi: jest.Mocked<ScaffolderFormFieldsApi> = {
    getFormFields: jest.fn(),
  };
  const wrapper = ({ children }: PropsWithChildren<{}>) =>
    wrapInTestApp(
      <TestApiProvider apis={[[formFieldsApiRef, mockFormFieldsApi]]}>
        {children}
      </TestApiProvider>,
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return field extensions from the React tree', async () => {
    mockFormFieldsApi.getFormFields.mockResolvedValue([]);
    const CustomFieldExtension = plugin.provide(
      createScaffolderFieldExtension({
        name: 'test',
        component: () => <div>Test</div>,
      }),
    );

    const { result } = renderHook(
      () =>
        useCustomFieldExtensions(
          <ScaffolderFieldExtensions>
            <CustomFieldExtension />
          </ScaffolderFieldExtensions>,
        ),
      {
        wrapper,
      },
    );

    expect(result.current).toEqual([expect.objectContaining({ name: 'test' })]);
  });

  it('should return field extensions from formFieldsApi', async () => {
    mockFormFieldsApi.getFormFields.mockResolvedValue([
      {
        name: 'blueprint',
        component: () => <div>Test</div>,
      },
    ]);

    const { result } = renderHook(() => useCustomFieldExtensions(<div />), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.length).toBeGreaterThan(0);
    });

    expect(result.current).toEqual([
      expect.objectContaining({ name: 'blueprint' }),
    ]);
  });

  it('should return field extensions from both sources', async () => {
    mockFormFieldsApi.getFormFields.mockResolvedValue([
      {
        name: 'blueprint',
        component: () => <div>Test</div>,
      },
    ]);

    const CustomFieldExtension = plugin.provide(
      createScaffolderFieldExtension({
        name: 'test',
        component: () => <div>Test</div>,
      }),
    );

    const { result } = renderHook(
      () =>
        useCustomFieldExtensions(
          <ScaffolderFieldExtensions>
            <CustomFieldExtension />
          </ScaffolderFieldExtensions>,
        ),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current).toHaveLength(2);
    });

    const fieldNames = result.current.map(field => field.name);
    expect(fieldNames).toEqual(expect.arrayContaining(['test', 'blueprint']));
  });
});
