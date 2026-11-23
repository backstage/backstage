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

import { bulkCommand } from './validate';
import { runner } from '../../../../lib/runner';
import { verifyManifest } from '../../../../lib/openapi/manifest';

jest.mock('../../../../lib/runner');
jest.mock('../../../../lib/openapi/manifest');

const mockRunner = runner as jest.MockedFunction<typeof runner>;
const mockVerify = verifyManifest as jest.MockedFunction<typeof verifyManifest>;

describe('validate command', () => {
  beforeEach(() => {
    // Run the command for a single package that has no local spec, such as a
    // client package, and report errors the way the real runner does.
    mockRunner.mockImplementation(async (_paths, command) => {
      let resultText = '';
      try {
        await command('/nonexistent/packages/foo-client');
      } catch (err) {
        resultText = err.message;
      }
      return [{ relativeDir: 'packages/foo-client', resultText }];
    });
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prints manifest warnings and passes without errors', async () => {
    mockVerify.mockResolvedValue({ errors: [], warnings: ['old generator'] });

    await bulkCommand();

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('old generator'),
    );
    expect(process.exit).not.toHaveBeenCalled();
  });

  it('fails on manifest errors even without a local spec', async () => {
    mockVerify.mockResolvedValue({
      errors: ['Generated files changed.\nFix: run the generator'],
      warnings: [],
    });

    await bulkCommand();

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Fix: run the generator'),
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
