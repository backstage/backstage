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

import fs from 'node:fs';
import path from 'node:path';

function loadHelpers() {
  return require('../config/getJestEnvironment');
}

describe('getJestEnvironment', () => {
  afterEach(() => {
    jest.dontMock('jest/package.json');
    jest.resetModules();
  });

  describe('resolveJest', () => {
    it('resolves the installed jest', () => {
      expect(loadHelpers().resolveJest()).toBe(require.resolve('jest'));
    });

    it('accepts Jest 29', () => {
      jest.doMock('jest/package.json', () => ({ version: '29.7.0' }));

      expect(loadHelpers().resolveJest()).toBe(require.resolve('jest'));
    });

    it('rejects unsupported Jest versions', () => {
      jest.doMock('jest/package.json', () => ({ version: '31.0.0' }));

      expect(() => loadHelpers().resolveJest()).toThrow(
        'Jest 31.0.0 is not supported. Please install Jest 30 or 29.',
      );
    });

    it('explains when jest is not installed', () => {
      jest.doMock('jest/package.json', () => {
        throw new Error("Cannot find module 'jest/package.json'");
      });

      expect(() => loadHelpers().resolveJest()).toThrow(
        'Jest is not installed. Please install jest@^30 or jest@^29 as a dev dependency.',
      );
    });
  });

  describe('getJestNodeEnvironment', () => {
    it('resolves the jest-environment-node of the installed jest', () => {
      const environmentPath: string = loadHelpers().getJestNodeEnvironment();
      const manifest = JSON.parse(
        fs.readFileSync(
          path.resolve(environmentPath, '../../package.json'),
          'utf8',
        ),
      );

      expect(manifest).toMatchObject({
        name: 'jest-environment-node',
        version: require('jest/package.json').version,
      });
    });
  });
});
