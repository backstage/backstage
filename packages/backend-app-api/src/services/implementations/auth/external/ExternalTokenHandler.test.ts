/*
 * Copyright 2024 The Backstage Authors
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

import { BackstagePrincipalAccessRestrictions } from '@backstage/backend-plugin-api';
import { ExternalTokenHandler } from './ExternalTokenHandler';
import { TokenHandler } from './types';

describe('ExternalTokenHandler', () => {
  it('skips over inner handlers that do not match, and applies plugin restrictions', async () => {
    const handler1: TokenHandler = {
      add: jest.fn(),
      verifyToken: jest.fn().mockResolvedValue(undefined),
    };

    const handler2: TokenHandler = {
      add: jest.fn(),
      verifyToken: jest.fn().mockResolvedValue({
        subject: 'sub',
        allAccessRestrictions: new Map(
          Object.entries({
            plugin1: {
              permissionNames: ['do.it'],
            } satisfies BackstagePrincipalAccessRestrictions,
          }),
        ),
      }),
    };

    const plugin1 = new ExternalTokenHandler('plugin1', [handler1, handler2]);
    const plugin2 = new ExternalTokenHandler('plugin2', [handler1, handler2]);

    await expect(plugin1.verifyToken('token')).resolves.toEqual({
      subject: 'sub',
      accessRestrictions: { permissionNames: ['do.it'] },
    });
    await expect(
      plugin2.verifyToken('token'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"This token's access is restricted to plugin(s) 'plugin1'"`,
    );
  });
});
