/*
 * Copyright 2025 The Backstage Authors
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

import { createNewPackage } from '../lib/createNewPackage';
import { default as newCommand } from './new';
import type { CliCommandContext } from '@backstage/cli-node';

jest.mock('../lib/createNewPackage');

describe.each([
  [undefined, undefined, undefined],
  ['internal', '@internal/', 'backstage-plugin-'],
  ['internal/', '@internal/', 'backstage-plugin-'],
  ['@internal', '@internal/', 'backstage-plugin-'],
  ['@internal/', '@internal/', 'backstage-plugin-'],
  ['acme-backstage', '@acme-backstage/', 'plugin-'],
  ['acme-backstage/', '@acme-backstage/', 'plugin-'],
  ['acme-backstage-plugins', '@acme-backstage-plugins/', 'plugin-'],
])('new', (scope, prefix, infix) => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it(`should generate naming options for --scope=${scope}`, async () => {
    const args = ['--skip-install'];
    if (scope) {
      args.push('--scope', scope);
    }
    const context: CliCommandContext = {
      args,
      info: { usage: 'backstage-cli new', name: 'new' },
    };
    await newCommand(context);
    expect(createNewPackage).toHaveBeenCalledWith(
      expect.objectContaining({
        configOverrides: expect.objectContaining({
          packageNamePrefix: prefix,
          packageNamePluginInfix: infix,
        }),
      }),
    );
  });
});
