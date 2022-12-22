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
import { useTemplateSchema } from './useTemplateSchema';
import { renderHook } from '@testing-library/react-hooks';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';
import { TemplateParameterSchema } from '../../types';

describe('useTemplateSchema', () => {
  it('should generate the correct schema', () => {
    const manifest: TemplateParameterSchema = {
      title: 'Test Template',
      description: 'Test Template Description',
      steps: [
        {
          title: 'Step 1',
          description: 'Step 1 Description',
          schema: {
            type: 'object',
            properties: {
              field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
            },
          },
        },
        {
          title: 'Step 2',
          description: 'Step 2 Description',
          schema: {
            type: 'object',
            properties: {
              field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
            },
          },
        },
      ],
    };

    const { result } = renderHook(() => useTemplateSchema(manifest), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[[featureFlagsApiRef, { isActive: () => false }]]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    const [first, second] = result.current.steps;

    expect(first.uiSchema).toEqual({
      field1: { 'ui:field': 'MyCoolComponent' },
    });

    expect(first.schema).toEqual({
      type: 'object',
      properties: {
        field1: { type: 'string' },
      },
    });

    expect(second.uiSchema).toEqual({
      field2: { 'ui:field': 'MyCoolerComponent' },
    });

    expect(second.schema).toEqual({
      type: 'object',
      properties: {
        field2: { type: 'string' },
      },
    });
  });

  describe('FeatureFlags', () => {
    it('should use featureFlags property to skip a step if the whole step is disabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              'ui:backstage': {
                featureFlag: 'my-feature-flag',
              },
              properties: {
                field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[[featureFlagsApiRef, { isActive: () => false }]]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      expect(result.current.steps).toHaveLength(1);
    });

    it('should use featureFlags property to enable a step if the whole step is enabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              'ui:backstage': {
                featureFlag: 'my-feature-flag',
              },
              properties: {
                field1: { type: 'string', 'ui:field': 'MyCoolComponent' },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[[featureFlagsApiRef, { isActive: () => true }]]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      expect(result.current.steps).toHaveLength(2);
    });

    it('should filter out the particular property if the featureFlag is disabled', () => {
      const manifest: TemplateParameterSchema = {
        title: 'Test Template',
        description: 'Test Template Description',
        steps: [
          {
            title: 'Step 1',
            description: 'Step 1 Description',
            schema: {
              type: 'object',
              properties: {
                field1: {
                  type: 'string',
                  'ui:field': 'MyCoolComponent',
                  'ui:backstage': {
                    featureFlag: 'my-feature-flag',
                  },
                },
                visibleField: {
                  type: 'string',
                  'ui:field': 'MyCoolComponent',
                },
              },
            },
          },
          {
            title: 'Step 2',
            description: 'Step 2 Description',
            schema: {
              type: 'object',
              properties: {
                field2: { type: 'string', 'ui:field': 'MyCoolerComponent' },
              },
            },
          },
        ],
      };

      const { result } = renderHook(() => useTemplateSchema(manifest), {
        wrapper: ({ children }) => (
          <TestApiProvider
            apis={[[featureFlagsApiRef, { isActive: () => false }]]}
          >
            {children}
          </TestApiProvider>
        ),
      });

      const [first] = result.current.steps;

      expect(first.schema).toEqual({
        type: 'object',
        properties: {
          visibleField: {
            type: 'string',
          },
        },
      });
    });
  });
});
