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
import {
  Generators,
  preserveTechDocsSources,
} from '@backstage/plugin-techdocs-node';

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

    (Generators.fromConfig as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue({ run: mockRun }),
      register: jest.fn(),
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

  it('stores sources only when --include-sources is set', async () => {
    const baseOpts = {
      sourceDir: '.',
      outputDir: './site',
      etag: 'test-etag',
      docker: false,
      verbose: false,
    };

    await generate({
      ...baseOpts,
      includeSources: false,
      sourceExcludes: ['*.png'],
    });
    expect(preserveTechDocsSources).not.toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalledWith(
      expect.not.objectContaining({ preserveSources: expect.anything() }),
    );

    await generate({
      ...baseOpts,
      includeSources: true,
      sourceExcludes: [],
      sourceAdditionalFiles: [],
    });
    expect(preserveTechDocsSources).toHaveBeenLastCalledWith(
      expect.objectContaining({
        inputDir: resolve('.'),
        outputDir: resolve('./site'),
        excludes: undefined,
        additionalFiles: undefined,
        etag: 'test-etag',
      }),
    );

    await generate({
      ...baseOpts,
      includeSources: true,
      sourceExcludes: ['*.png', '*.jpg'],
      sourceAdditionalFiles: ['README.md', 'CONTRIBUTING.md'],
    });
    expect(preserveTechDocsSources).toHaveBeenLastCalledWith(
      expect.objectContaining({
        excludes: ['*.png', '*.jpg'],
        additionalFiles: ['README.md', 'CONTRIBUTING.md'],
      }),
    );
  });
});
