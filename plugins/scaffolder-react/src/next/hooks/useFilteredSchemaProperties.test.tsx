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

import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { TestApiProvider } from '@backstage/test-utils';
import { useFilteredSchemaProperties } from './useFilteredSchemaProperties';
import { TemplateParameterSchema } from '../../types';

describe('useFilteredSchemaProperties', () => {
  it('should hide "Fill in some steps" from steps of template', () => {
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

    const sortedManifest = renderHook(() =>
      useFilteredSchemaProperties(manifest),
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

    expect(sortedManifest).toEqual(expectedManifest);
  });
});
