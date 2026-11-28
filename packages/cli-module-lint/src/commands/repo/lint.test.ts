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
import { PackageGraph, runWorkerQueueThreads } from '@backstage/cli-node';
import lint from './lint';

jest.mock('cleye', () => ({ cli: jest.fn() }));
jest.mock('@backstage/cli-common', () => ({
  targetPaths: { rootDir: '/workspace' },
}));
jest.mock('@backstage/cli-node', () => ({
  PackageGraph: { listTargetPackages: jest.fn() },
  SuccessCache: { create: jest.fn().mockReturnValue({}) },
  runWorkerQueueThreads: jest.fn(),
}));

describe('repo lint formatter resolution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (PackageGraph.listTargetPackages as jest.Mock).mockResolvedValue([]);
    (runWorkerQueueThreads as jest.Mock).mockResolvedValue({ results: [] });
  });

  it.each(['eslint-formatter-friendly', 'json', './custom-formatter.js'])(
    'passes %s to the worker with the right resolution',
    async format => {
      (cli as jest.Mock).mockReturnValue({ flags: { format } });
      const chdir = jest.spyOn(process, 'chdir').mockImplementation(() => {});
      const forceColor = process.env.FORCE_COLOR;
      try {
        await lint({ args: [], info: { usage: 'repo lint' } } as any);
        expect(runWorkerQueueThreads).toHaveBeenCalledWith(
          expect.objectContaining({
            context: expect.objectContaining({
              format:
                format === 'eslint-formatter-friendly'
                  ? require.resolve('eslint-formatter-friendly')
                  : format,
            }),
          }),
        );
        expect(chdir.mock.calls).toEqual(
          format === 'eslint-formatter-friendly' ? [['/workspace']] : [],
        );
      } finally {
        chdir.mockRestore();
        if (forceColor === undefined) {
          delete process.env.FORCE_COLOR;
        } else {
          process.env.FORCE_COLOR = forceColor;
        }
      }
    },
  );
});
