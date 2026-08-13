/*
 * Copyright 2026 The Backstage Authors
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

import { resolve } from 'node:path';
import { TechdocsGenerator } from '@backstage/plugin-techdocs-node';

const mockRun = jest.fn();

jest.mock('@backstage/plugin-techdocs-node');
jest.mock('fs-extra');
jest.mock('../../lib/utility');

import generate from './generate';

describe('generate', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { getMkdocsYml } = require('@backstage/plugin-techdocs-node');
    getMkdocsYml.mockResolvedValue({
      path: '/tmp/mkdocs.yml',
      configIsTemporary: false,
    });

    (TechdocsGenerator.fromConfig as jest.Mock).mockReturnValue({
      run: mockRun,
    });

    const { createLogger, getLogStream } = require('../../lib/utility');
    createLogger.mockReturnValue({
      info: jest.fn(),
      verbose: jest.fn(),
      error: jest.fn(),
    });
    getLogStream.mockReturnValue({});

    const fsExtra = require('fs-extra');
    fsExtra.ensureDir.mockResolvedValue(undefined);
  });

  it('should pass preserveSources when --include-sources is set', async () => {
    await generate({
      sourceDir: '.',
      outputDir: './site',
      docker: false,
      verbose: false,
      includeSources: true,
      sourceExcludes: [],
    });

    expect(mockRun).toHaveBeenCalledWith(
      expect.objectContaining({
        inputDir: resolve('.'),
        outputDir: resolve('./site'),
        preserveSources: true,
        sourceExcludes: undefined,
      }),
    );
  });

  it('should not set preserveSources when --include-sources is not set', async () => {
    await generate({
      sourceDir: '.',
      outputDir: './site',
      docker: false,
      verbose: false,
      includeSources: false,
      sourceExcludes: [],
    });

    expect(mockRun).toHaveBeenCalledWith(
      expect.objectContaining({
        preserveSources: false,
        sourceExcludes: undefined,
      }),
    );
  });

  it('should pass sourceExcludes from --source-excludes flag', async () => {
    await generate({
      sourceDir: '.',
      outputDir: './site',
      docker: false,
      verbose: false,
      includeSources: true,
      sourceExcludes: ['*.png', '*.jpg'],
    });

    expect(mockRun).toHaveBeenCalledWith(
      expect.objectContaining({
        preserveSources: true,
        sourceExcludes: ['*.png', '*.jpg'],
      }),
    );
  });

  it('should pass sourceAdditionalFiles from --source-additional-files flag', async () => {
    await generate({
      sourceDir: '.',
      outputDir: './site',
      docker: false,
      verbose: false,
      includeSources: true,
      sourceExcludes: [],
      sourceAdditionalFiles: ['README.md', 'CONTRIBUTING.md'],
    });

    expect(mockRun).toHaveBeenCalledWith(
      expect.objectContaining({
        preserveSources: true,
        sourceAdditionalFiles: ['README.md', 'CONTRIBUTING.md'],
      }),
    );
  });
});
