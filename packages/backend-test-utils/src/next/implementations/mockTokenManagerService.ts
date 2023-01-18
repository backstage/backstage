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
import { TokenManager } from '@backstage/backend-common';
import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';

class TokenManagerMock implements TokenManager {
  async getToken(): Promise<{ token: string }> {
    return { token: 'mock-token' };
  }
  async authenticate(token: string): Promise<void> {
    if (token !== 'mock-token') {
      throw new Error('Invalid token');
    }
  }
}

/** @alpha */
export const mockTokenManagerFactory = createServiceFactory({
  service: coreServices.tokenManager,
  deps: {},
  async factory() {
    return new TokenManagerMock();
  },
});
