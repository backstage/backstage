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

import { cli } from 'cleye';
import { ESLint } from 'eslint';
import lint from './lint';

jest.mock('cleye', () => ({ cli: jest.fn() }));
jest.mock('@backstage/cli-common', () => ({
  targetPaths: { dir: '/workspace/package', rootDir: '/workspace' },
}));
jest.mock('eslint', () => ({
  ESLint: jest.fn(),
}));

const mockLoadFormatter = jest.fn();
const mockCli = cli as jest.Mock;

describe('package lint formatter resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ESLint as unknown as jest.Mock).mockImplementation(() => ({
      lintFiles: jest.fn().mockResolvedValue([]),
      loadFormatter: mockLoadFormatter.mockResolvedValue({
        format: jest.fn().mockReturnValue(''),
      }),
    }));
  });

  it.each(['eslint-formatter-friendly', 'json', './custom-formatter.js'])(
    'loads %s without changing custom formatter resolution',
    async format => {
      mockCli.mockReturnValue({ flags: { format }, _: [] });
      const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});
      try {
        await lint({ args: [], info: { usage: 'package lint' } } as any);
        expect(mockLoadFormatter).toHaveBeenCalledWith(
          format === 'eslint-formatter-friendly'
            ? require.resolve('eslint-formatter-friendly')
            : format,
        );
        if (format === 'eslint-formatter-friendly') {
          expect(chdir).toHaveBeenCalledWith('/workspace');
        } else {
          expect(chdir).not.toHaveBeenCalled();
        }
      } finally {
        chdir.mockRestore();
      }
    },
  );
});
