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

import React, { PropsWithChildren } from 'react';
import { createPlugin, PluginProvider } from '@backstage/core-plugin-api';

/**
 * Mock for PluginProvider to use in unit tests
 * @alpha
 */
export const MockPluginProvider = ({ children }: PropsWithChildren<{}>) => {
  type TestInputPluginOptions = {};
  type TestPluginOptions = {};
  const plugin = createPlugin({
    id: 'my-plugin',
    __experimentalConfigure(_: TestInputPluginOptions): TestPluginOptions {
      return {};
    },
  });

  return <PluginProvider plugin={plugin}>{children}</PluginProvider>;
};
