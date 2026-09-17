/*
 * Copyright 2025 The Backstage Authors
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

import { PortableTemplateConfig } from '../types';
import inquirer from 'inquirer';
import { withLogCollector } from '@backstage/test-utils';
import { selectTemplateInteractively } from './selectTemplateInteractively';

describe('selectTemplateInteractively', () => {
  const mockConfig = {
    isUsingDefaultTemplates: false,
    templatePointers: [
      { name: 'template1', target: '/path/to/template1' },
      { name: 'template2', target: '/path/to/template2' },
    ],
  } as PortableTemplateConfig;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should select a template interactively', async () => {
    jest.spyOn(inquirer, 'prompt').mockResolvedValueOnce({ name: 'template1' });

    const result = await selectTemplateInteractively(mockConfig);

    expect(result).toEqual({ name: 'template1', target: '/path/to/template1' });
  });

  it('should error if interactive selections is not found', async () => {
    jest
      .spyOn(inquirer, 'prompt')
      .mockResolvedValueOnce({ name: 'nonexistent' });

    await expect(selectTemplateInteractively(mockConfig)).rejects.toThrow(
      "Template 'nonexistent' not found",
    );
  });

  it('should use preselected template name', async () => {
    const result = await selectTemplateInteractively(mockConfig, 'template2');

    expect(result).toEqual({ name: 'template2', target: '/path/to/template2' });
  });

  it('should throw an error if template is not found', async () => {
    await expect(
      selectTemplateInteractively(mockConfig, 'nonexistent'),
    ).rejects.toThrow("Template 'nonexistent' not found");
  });

  it('should rewrite plugin to frontend-plugin if default templates are used', async () => {
    await expect(
      selectTemplateInteractively(mockConfig, 'plugin'),
    ).rejects.toThrow("Template 'plugin' not found");

    const logs = await withLogCollector(async () => {
      await expect(
        selectTemplateInteractively(
          { ...mockConfig, isUsingDefaultTemplates: true },
          'plugin',
        ),
      ).rejects.toThrow("Template 'frontend-plugin' not found");
    });
    expect(logs).toEqual({
      log: [],
      warn: [
        "DEPRECATION WARNING: The 'plugin' template is deprecated, use 'frontend-plugin' instead",
      ],
      error: [],
    });
  });
});
