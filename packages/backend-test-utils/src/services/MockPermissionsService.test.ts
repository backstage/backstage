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

import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { MockPermissionsService } from './MockPermissionsService';

describe('MockPermissionsService', () => {
  it('should return the correct result', async () => {
    const permission = {
      permission: {
        name: 'test',
        type: 'basic',
        attributes: {},
      },
    } as const;

    const defaultService = new MockPermissionsService();
    const allowService = new MockPermissionsService({
      result: AuthorizeResult.ALLOW,
    });
    const denyService = new MockPermissionsService({
      result: AuthorizeResult.DENY,
    });

    await expect(defaultService.authorize([permission])).resolves.toEqual([
      {
        ...permission,
        result: AuthorizeResult.ALLOW,
      },
    ]);
    await expect(allowService.authorize([permission])).resolves.toEqual([
      {
        ...permission,
        result: AuthorizeResult.ALLOW,
      },
    ]);
    await expect(denyService.authorize([permission])).resolves.toEqual([
      {
        ...permission,
        result: AuthorizeResult.DENY,
      },
    ]);
  });
});
