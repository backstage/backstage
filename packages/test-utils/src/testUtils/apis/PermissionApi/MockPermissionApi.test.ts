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

import { AuthorizeResult, Permission } from '@backstage/permission-common';
import { MockPermissionApi } from './MockPermissionApi';

describe('MockPermissionApi', () => {
  it('returns ALLOW by default', async () => {
    const api = new MockPermissionApi();

    await expect(
      api.authorize([
        { permission: { name: 'permission.1' } as Permission },
        { permission: { name: 'permission.2' } as Permission },
      ]),
    ).resolves.toEqual([
      { result: AuthorizeResult.ALLOW },
      { result: AuthorizeResult.ALLOW },
    ]);
  });

  it('allows passing a handler to customize the result', async () => {
    const api = new MockPermissionApi(request =>
      request.permission.name === 'permission.2'
        ? AuthorizeResult.DENY
        : AuthorizeResult.ALLOW,
    );

    await expect(
      api.authorize([
        { permission: { name: 'permission.1' } as Permission },
        { permission: { name: 'permission.2' } as Permission },
      ]),
    ).resolves.toEqual([
      { result: AuthorizeResult.ALLOW },
      { result: AuthorizeResult.DENY },
    ]);
  });
});
