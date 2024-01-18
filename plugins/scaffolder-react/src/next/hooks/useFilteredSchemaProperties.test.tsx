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

import { renderHook } from '@testing-library/react';
import { useFilteredSchemaProperties } from './useFilteredSchemaProperties';
import { TemplateParameterSchema } from '../../types';
import { TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { featureFlagsApiRef } from '@backstage/core-plugin-api';

const mockFeatureFlagApi = {
  isActive: jest.fn(),
};

describe('useFilteredSchemaProperties', () => {
  it('should return the same manifest if no feature flag is set', () => {
    mockFeatureFlagApi.isActive.mockReturnValue(true);

    const manifest: TemplateParameterSchema = {
      title: 'Test Action template',
      description: 'scaffolder v1beta3 template demo',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            type: 'object',
            'backstage:featureFlag': 'experimental-feature',
            properties: {
              name: {
                description: 'Unique name of the component',
                title: 'Name',
                type: 'string',
                'ui:autofocus': true,
              },
            },
          },
        },
        {
          title: 'Choose a location',
          schema: {
            type: 'object',
            properties: {
              repoUrl: {
                type: 'string',
                title: 'Repository Location',
                'ui:field': 'RepoUrlPicker',
              },
            },
          },
        },
      ],
    };

    const filteredManifest = renderHook(
      () => useFilteredSchemaProperties(manifest),
      {
        wrapper: ({ children }) => (
          <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagApi]]}>
            {children}
          </TestApiProvider>
        ),
      },
    );

    expect(filteredManifest.result.current).toEqual(manifest);
  });

  it('should hide individual fields from steps of template', () => {
    mockFeatureFlagApi.isActive.mockReturnValue(false);

    const manifest: TemplateParameterSchema = {
      title: 'Test Action template',
      description: 'scaffolder v1beta3 template demo',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            type: 'object',
            properties: {
              name: {
                description: 'Unique name of the component',
                title: 'Name',
                type: 'string',
                'ui:autofocus': true,
              },
            },
          },
        },
        {
          title: 'Choose a location',
          schema: {
            type: 'object',
            properties: {
              repoUrl: {
                type: 'string',
                title: 'Repository Location',
                'ui:field': 'RepoUrlPicker',
                'backstage:featureFlag': 'experimental-feature',
              },
            },
          },
        },
      ],
    };

    const filteredManifest = renderHook(
      () => useFilteredSchemaProperties(manifest),
      {
        wrapper: ({ children }) => (
          <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagApi]]}>
            {children}
          </TestApiProvider>
        ),
      },
    );

    const expectedManifest: TemplateParameterSchema = {
      title: 'Test Action template',
      description: 'scaffolder v1beta3 template demo',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            type: 'object',
            properties: {
              name: {
                description: 'Unique name of the component',
                title: 'Name',
                type: 'string',
                'ui:autofocus': true,
              },
            },
          },
        },
        {
          title: 'Choose a location',
          schema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };

    expect(filteredManifest.result.current).toEqual(expectedManifest);
  });

  it('should hide "Fill in some steps" from steps of template', () => {
    mockFeatureFlagApi.isActive.mockReturnValue(false);

    const manifest: TemplateParameterSchema = {
      title: 'Test Action template',
      description: 'scaffolder v1beta3 template demo',
      steps: [
        {
          title: 'Fill in some steps',
          schema: {
            type: 'object',
            'backstage:featureFlag': 'experimental-feature',
            properties: {
              name: {
                description: 'Unique name of the component',
                title: 'Name',
                type: 'string',
                'ui:autofocus': true,
              },
            },
          },
        },
        {
          title: 'Choose a location',
          schema: {
            type: 'object',
            properties: {
              repoUrl: {
                type: 'string',
                title: 'Repository Location',
                'ui:field': 'RepoUrlPicker',
              },
            },
          },
        },
      ],
    };

    const filteredManifest = renderHook(
      () => useFilteredSchemaProperties(manifest),
      {
        wrapper: ({ children }) => (
          <TestApiProvider apis={[[featureFlagsApiRef, mockFeatureFlagApi]]}>
            {children}
          </TestApiProvider>
        ),
      },
    );

    const expectedManifest: TemplateParameterSchema = {
      title: 'Test Action template',
      description: 'scaffolder v1beta3 template demo',
      steps: [
        {
          title: 'Choose a location',
          schema: {
            type: 'object',
            properties: {
              repoUrl: {
                type: 'string',
                title: 'Repository Location',
                'ui:field': 'RepoUrlPicker',
              },
            },
          },
        },
      ],
    };

    expect(filteredManifest.result.current).toEqual(expectedManifest);
  });
});
