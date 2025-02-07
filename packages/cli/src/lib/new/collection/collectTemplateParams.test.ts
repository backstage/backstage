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
import { NewConfig } from '../config/types';
import { collectTemplateParams } from './collectTemplateParams';

describe('collectTemplateParams', () => {
  const baseOptions = {
    config: {
      isUsingDefaultTemplates: false,
      templatePointers: [],
      globals: {},
    } satisfies NewConfig,
    template: {
      id: 'test',
      templatePath: '/test',
      targetPath: '/example',
    },
    globals: {},
    prefilledParams: {},
  };

  it('should return default values if not provided', async () => {
    await expect(collectTemplateParams(baseOptions)).resolves.toEqual({
      id: '',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      moduleId: '',
    });
  });

  it('should include all non-standard global and prompt values', async () => {
    await expect(
      collectTemplateParams({ ...baseOptions, globals: { foo: 'bar' } }),
    ).resolves.toEqual({
      id: '',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      moduleId: '',
      foo: 'bar',
    });
  });

  it('should use prefilled parameters', async () => {
    await expect(
      collectTemplateParams({
        ...baseOptions,
        template: {
          ...baseOptions.template,
          prompts: ['id'],
        },
        prefilledParams: { id: 'test' },
      }),
    ).resolves.toEqual({
      id: 'test',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      moduleId: '',
    });
  });

  it('should prompt for parameters', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ id: 'test' });

    await expect(
      collectTemplateParams({
        ...baseOptions,
        template: {
          ...baseOptions.template,
          prompts: ['id'],
        },
        prefilledParams: {},
      }),
    ).resolves.toEqual({
      id: 'test',
      private: true,
      baseVersion: '0.1.0',
      owner: '',
      license: 'Apache-2.0',
      targetPath: '/example',
      scope: '',
      moduleId: '',
    });
  });
});
