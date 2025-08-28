/*
 * Copyright 2020 The Backstage Authors
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

import { hasBackstageProtocolPackageManagerPlugin } from './packageManagerPlugin';

// Mock the dependencies
jest.mock('./paths', () => ({
  paths: {
    resolveTargetRoot: jest.fn(),
  },
}));

import * as fs from 'fs-extra';

jest.mock('fs-extra');
const mockFs = fs as jest.Mocked<typeof fs>;

jest.mock('yaml', () => ({
  parse: jest.fn(),
}));

import * as yaml from 'yaml';
const mockYaml = yaml as jest.Mocked<typeof yaml>;

describe('hasBackstageProtocolPackageManagerPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when yarn plugin is available', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    mockFs.readFileSync.mockReturnValue(`
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-backstage.cjs
    `);
    
    mockYaml.parse.mockReturnValue({
      plugins: [
        { path: '.yarn/plugins/@yarnpkg/plugin-backstage.cjs' }
      ]
    });

    const result = hasBackstageProtocolPackageManagerPlugin();

    expect(result).toBe(true);
  });

  it('should return false when file does not exist', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    // Mock file not found
    const error = new Error('File not found');
    (error as any).code = 'ENOENT';
    mockFs.readFileSync.mockImplementation(() => {
      throw error;
    });

    const result = hasBackstageProtocolPackageManagerPlugin();

    expect(result).toBe(false);
  });

  it('should return false when yarn plugin config is different', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    mockFs.readFileSync.mockReturnValue(`
plugins:
  - path: .yarn/plugins/some-other-plugin.cjs
    `);
    
    mockYaml.parse.mockReturnValue({
      plugins: [
        { path: '.yarn/plugins/some-other-plugin.cjs' }
      ]
    });

    const result = hasBackstageProtocolPackageManagerPlugin();

    expect(result).toBe(false);
  });

  it('should return false when no plugins are configured', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    mockFs.readFileSync.mockReturnValue(`
someOtherConfig: value
    `);
    
    mockYaml.parse.mockReturnValue({
      someOtherConfig: 'value'
    });

    const result = hasBackstageProtocolPackageManagerPlugin();

    expect(result).toBe(false);
  });

  it('should return false when file is empty', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    mockFs.readFileSync.mockReturnValue('');

    const result = hasBackstageProtocolPackageManagerPlugin();

    expect(result).toBe(false);
  });

  it('should throw error when file has unexpected content', () => {
    const { paths } = require('./paths');
    paths.resolveTargetRoot.mockReturnValue('/mock/path/.yarnrc.yml');
    
    mockFs.readFileSync.mockReturnValue(`
plugins:
  - invalidStructure
    `);
    
    mockYaml.parse.mockReturnValue({
      plugins: [
        'invalidStructure'
      ]
    });

    expect(() => hasBackstageProtocolPackageManagerPlugin()).toThrow(/Unexpected content in .yarnrc.yml/);
  });
});