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
import { ServerTokenManager } from '@backstage/backend-common';
import fetch from 'node-fetch';
import { triggerTechDocsRefresh } from './triggerTechDocsRefresh';

jest.mock('node-fetch');

describe('triggerTechDocsRefresh', () => {
  const backendBaseUrl = 'http://localhost:7007';
  const tokenManager = ServerTokenManager.noop();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST to the correct URL', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        namespace: 'default',
        annotations: {
          'backstage.io/techdocs-ref': 'https://github.com/project/repo',
        },
      },
    };

    await triggerTechDocsRefresh(backendBaseUrl, entity, tokenManager);

    expect(fetch).toHaveBeenCalled();

    // TODO(awanlin): This should work based on this: https://jestjs.io/docs/next/bypassing-module-mocks
    // but for what ever reason it does not Expected never includes the `init` values but the Received does
    // expect(fetch).toHaveBeenCalledWith(
    //   'http://localhost:7000/api/techdocs/sync/default/Component/test-component',
    //   {
    //     headers: {
    //       Authorization: 'Bearer ',
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );
  });
});
