/*
 * Copyright 2026 The Backstage Authors
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

import { filterCatalogClusterAuthMetadata } from './catalogClusterAuthMetadata';
import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';

describe('filterCatalogClusterAuthMetadata', () => {
  it('passes through kubernetes.io annotations and blocks serviceAccountToken', () => {
    expect(
      filterCatalogClusterAuthMetadata({
        [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'oidc',
        'kubernetes.io/oidc-token-provider': 'google',
        serviceAccountToken: 'secret',
        'evil.example/annotation': 'value',
      }),
    ).toEqual({
      [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'oidc',
      'kubernetes.io/oidc-token-provider': 'google',
    });
  });
});
