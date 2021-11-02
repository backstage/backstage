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
export const entityMock = {
  metadata: {
    namespace: 'default',
    name: 'sample-test-service',
    description: 'A service for testing Scorecards.\n',
    generation: 1,
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  spec: {
    type: 'service',
    owner: 'backstage@backstage.io',
    lifecycle: 'experimental',
  },
  relations: [
    {
      target: {
        kind: 'group',
        namespace: 'default',
        name: 'backstage@backstage.io',
      },
      type: 'ownedBy',
    },
  ],
};
