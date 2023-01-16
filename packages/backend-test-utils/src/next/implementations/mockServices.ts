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

import {
  IdentityService,
  LoggerService,
  TokenManagerService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { MockIdentityService } from './mockIdentityService';
import { MockLogger } from './mockRootLoggerService';

/**
 * @alpha
 */
export namespace mockServices {
  export namespace config {
    export type Options = { data?: JsonObject };
  }
  export function config(options?: config.Options) {
    return new ConfigReader(options?.data, 'mock-config');
  }

  export namespace rootLogger {
    export type Options = {
      levels:
        | boolean
        | { error: boolean; warn: boolean; info: boolean; debug: boolean };
    };
  }
  export function rootLogger(options?: rootLogger.Options): LoggerService {
    return new MockLogger(options?.levels ?? false, {});
  }

  export function tokenManager(): TokenManagerService {
    return {
      async getToken(): Promise<{ token: string }> {
        return { token: 'mock-token' };
      },
      async authenticate(token: string): Promise<void> {
        if (token !== 'mock-token') {
          throw new Error('Invalid token');
        }
      },
    };
  }

  export function identity(): IdentityService {
    return new MockIdentityService();
  }

  // TODO(Rugvip): Not all core services have implementations available here yet.
  //               some may need a bit more refactoring for it to be simpler to
  //               re-implement functioning mock versions here.
}
