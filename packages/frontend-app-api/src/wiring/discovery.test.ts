/*
 * Copyright 2023 The Backstage Authors
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

import { createPlugin } from '@backstage/frontend-plugin-api';
import { getAvailableFeatures } from './discovery';

const globalSpy = jest.fn();
Object.defineProperty(global, '__@backstage/discovered__', {
  get: globalSpy,
});

describe('getAvailableFeatures', () => {
  afterEach(jest.resetAllMocks);

  it('should discover nothing with undefined global', () => {
    expect(getAvailableFeatures()).toEqual([]);
  });

  it('should discover nothing with empty global', () => {
    globalSpy.mockReturnValue({
      modules: [],
    });
    expect(getAvailableFeatures()).toEqual([]);
  });

  it('should discover a plugin', () => {
    const testPlugin = createPlugin({ id: 'test' });
    globalSpy.mockReturnValue({
      modules: [{ default: testPlugin }],
    });
    expect(getAvailableFeatures()).toEqual([testPlugin]);
  });

  it('should ignore garbage', () => {
    globalSpy.mockReturnValueOnce({ modules: [{ default: null }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: undefined }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: Symbol() }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: () => {} }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: 0 }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: false }] });
    expect(getAvailableFeatures()).toEqual([]);
    globalSpy.mockReturnValueOnce({ modules: [{ default: true }] });
    expect(getAvailableFeatures()).toEqual([]);
  });

  it('should discover multiple plugins', () => {
    const test1Plugin = createPlugin({ id: 'test1' });
    const test2Plugin = createPlugin({ id: 'test2' });
    const test3Plugin = createPlugin({ id: 'test3' });
    globalSpy.mockReturnValue({
      modules: [
        { default: test1Plugin },
        { default: test2Plugin },
        { default: test3Plugin },
      ],
    });
    expect(getAvailableFeatures()).toEqual([
      test1Plugin,
      test2Plugin,
      test3Plugin,
    ]);
  });
});
