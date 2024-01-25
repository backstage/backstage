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

import React from 'react';
import { createNavLogoExtension } from './createNavLogoExtension';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
}));

describe('createNavLogoExtension', () => {
  it('creates the extension properly', () => {
    expect(
      createNavLogoExtension({
        name: 'test',
        logoFull: <div>Logo Full</div>,
        logoIcon: <div>Logo Icon</div>,
      }),
    ).toEqual({
      $$type: '@backstage/ExtensionDefinition',
      version: 'v1',
      kind: 'nav-logo',
      name: 'test',
      attachTo: { id: 'app/nav', input: 'logos' },
      disabled: false,
      inputs: {},
      output: {
        logos: expect.anything(),
      },
      factory: expect.any(Function),
      toString: expect.any(Function),
    });
  });
});
