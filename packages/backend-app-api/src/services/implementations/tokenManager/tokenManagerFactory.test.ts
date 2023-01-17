/*
 * Copyright 2022 The Backstage Authors
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
  LoggerService,
  ServiceFactory,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { tokenManagerFactory } from './tokenManagerFactory';

describe('tokenManagerFactory', () => {
  it('should create managers that can share tokens in development', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'development';

    const factory = tokenManagerFactory() as Exclude<
      ServiceFactory<TokenManagerService>,
      { scope: 'root' }
    >;
    const deps = {
      config: new ConfigReader({}),
      logger: { warn() {} } as unknown as LoggerService,
    };

    const ctx = await factory.createRootContext?.(deps);
    const manager1 = await factory.factory!(deps, ctx);
    const manager2 = await factory.factory!(deps, ctx);

    const { token } = await manager1.getToken();
    await expect(manager2.authenticate(token)).resolves.toBeUndefined();
  });
});
