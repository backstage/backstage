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
import { createMockDirectory } from '@backstage/backend-test-utils';
import { ServiceAccountStrategy } from './ServiceAccountStrategy';

const mockDir = createMockDirectory({
  content: {
    'token.txt': 'in-cluster-token',
  },
});

jest.mock('@kubernetes/client-node', () => ({
  KubeConfig: class {
    #loaded = false;
    loadFromCluster() {
      this.#loaded = true;
    }
    getCurrentUser() {
      if (!this.#loaded) {
        throw new Error('loadFromCluster not called');
      }
      return {
        authProvider: {
          config: {
            get tokenFile() {
              return mockDir.resolve('token.txt');
            },
          },
        },
      };
    }
  },
}));

describe('ServiceAccountStrategy', () => {
  describe('#getCredential', () => {
    it('reads bearer token from config', async () => {
      const strategy = new ServiceAccountStrategy();

      const credential = await strategy.getCredential({
        name: '',
        url: '',
        authMetadata: { serviceAccountToken: 'from config' },
      });

      expect(credential).toStrictEqual({
        type: 'bearer token',
        token: 'from config',
      });
    });

    describe('when serviceAccountToken is absent from config', () => {
      it('reads in-cluster token', async () => {
        const strategy = new ServiceAccountStrategy();

        const credential = await strategy.getCredential({
          name: '',
          url: '',
          authMetadata: {},
        });

        expect(credential).toStrictEqual({
          type: 'bearer token',
          token: 'in-cluster-token',
        });
      });
    });
  });
});
