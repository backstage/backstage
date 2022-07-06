/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { usePluginOptions, PluginProvider } from './usePluginOptions';
import { createPlugin } from '../plugin';

describe('usePluginOptions', () => {
  it('should provide a versioned value to hook', () => {
    type TestInputPluginOptions = {
      'key-1': string;
    };

    type TestPluginOptions = {
      'key-1': string;
      'key-2': string;
    };

    const plugin = createPlugin({
      id: 'my-plugin',
      __experimentalConfigure(_: TestInputPluginOptions): TestPluginOptions {
        return { 'key-1': 'value-1', 'key-2': 'value-2' };
      },
    });

    const rendered = renderHook(() => usePluginOptions(), {
      wrapper: ({ children }) => (
        <PluginProvider plugin={plugin}>{children}</PluginProvider>
      ),
    });

    const config = rendered.result.current;

    expect(config).toEqual({
      'key-1': 'value-1',
      'key-2': 'value-2',
    });
  });
});
