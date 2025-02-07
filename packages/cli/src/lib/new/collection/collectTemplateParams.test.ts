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

import inquirer from 'inquirer';
import { PortableTemplateConfig } from '../types';
import { collectTemplateParams } from './collectTemplateParams';

describe('collectTemplateParams', () => {
  const baseOptions = {
    config: {
      isUsingDefaultTemplates: false,
      templatePointers: [],
      globals: {},
    } satisfies PortableTemplateConfig,
    template: {
      id: 'test',
      templatePath: '/test',
      targetPath: '/example',
      role: 'frontend-plugin' as const,
    },
    prefilledParams: {
      pluginId: 'test',
      owner: '',
    },
  };

  it('should return default values if not provided', async () => {
    await expect(collectTemplateParams(baseOptions)).resolves.toEqual({
      pluginId: 'test',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
    });
  });

  it('should include all non-standard global and prompt values', async () => {
    await expect(
      collectTemplateParams({
        ...baseOptions,
        config: { ...baseOptions.config, globals: { foo: 'bar' } },
      }),
    ).resolves.toEqual({
      pluginId: 'test',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      foo: 'bar',
    });
  });

  it('should prompt for missing parameters', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ pluginId: 'other' });

    await expect(
      collectTemplateParams({
        ...baseOptions,
        prefilledParams: {},
      }),
    ).resolves.toEqual({
      pluginId: 'other',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
    });
  });
});
