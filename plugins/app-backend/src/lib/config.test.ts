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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { injectConfig } from './config';

describe('injectConfig', () => {
  const mockDir = createMockDirectory();

  const baseOptions = {
    appConfigs: [],
    staticDir: mockDir.path,
    logger: mockServices.logger.mock(),
  };

  beforeEach(() => {
    mockDir.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should inject without config', async () => {
    mockDir.setContent({
      'main.js': '"__APP_INJECTED_RUNTIME_CONFIG__"',
    });

    await injectConfig(baseOptions);

    expect(mockDir.content()).toEqual({
      'main.js': '/*__APP_INJECTED_CONFIG_MARKER__*/"[]"/*__INJECTED_END__*/',
    });
  });

  it('should inject config repeatedly if marker appears multiple times', async () => {
    mockDir.setContent({
      'main.js':
        '({a:"__APP_INJECTED_RUNTIME_CONFIG__",b:"__APP_INJECTED_RUNTIME_CONFIG__"})',
    });

    await injectConfig(baseOptions);

    expect(mockDir.content()).toEqual({
      'main.js':
        '({a:/*__APP_INJECTED_CONFIG_MARKER__*/"[]"/*__INJECTED_END__*/,b:/*__APP_INJECTED_CONFIG_MARKER__*/"[]"/*__INJECTED_END__*/})',
    });
  });

  it('should find the correct file to inject', async () => {
    mockDir.setContent({
      'before.js': 'NO_PLACEHOLDER_HERE',
      'not-js.txt': 'NO_PLACEHOLDER_HERE',
      'main.js': '"__APP_INJECTED_RUNTIME_CONFIG__"',
      'after.js': 'NO_PLACEHOLDER_HERE',
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 0 }, context: 'test' }],
    });

    expect(mockDir.content()).toEqual({
      'before.js': 'NO_PLACEHOLDER_HERE',
      'not-js.txt': 'NO_PLACEHOLDER_HERE',
      'main.js':
        '/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/',
      'after.js': 'NO_PLACEHOLDER_HERE',
    });
  });

  it('should re-inject config', async () => {
    mockDir.setContent({
      'main.js': 'JSON.parse("__APP_INJECTED_RUNTIME_CONFIG__")',
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 0 }, context: 'test' }],
    });

    expect(mockDir.content()).toEqual({
      'main.js':
        'JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/)',
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 1, y: 2 }, context: 'test' }],
    });

    expect(mockDir.content()).toEqual({
      'main.js':
        'JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":1,\\"y\\":2},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/)',
    });
  });

  it('should re-inject config repeatedly if needed', async () => {
    mockDir.setContent({
      'main.js':
        '({ a: JSON.parse("__APP_INJECTED_RUNTIME_CONFIG__"), b: JSON.parse("__APP_INJECTED_RUNTIME_CONFIG__") })',
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 0 }, context: 'test' }],
    });

    expect(mockDir.content()).toEqual({
      'main.js':
        '({ a: JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/), b: JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":0},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/) })',
    });

    await injectConfig({
      ...baseOptions,
      appConfigs: [{ data: { x: 1, y: 2 }, context: 'test' }],
    });

    expect(mockDir.content()).toEqual({
      'main.js':
        '({ a: JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":1,\\"y\\":2},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/), b: JSON.parse(/*__APP_INJECTED_CONFIG_MARKER__*/"[{\\"data\\":{\\"x\\":1,\\"y\\":2},\\"context\\":\\"test\\"}]"/*__INJECTED_END__*/) })',
    });
  });
});
