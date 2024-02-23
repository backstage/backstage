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

import {
  ApiRef,
  AuthRequestOptions,
  createApiRef,
} from '@backstage/core-plugin-api';

/**
 * This API provides access to Pinniped credentials. It lets you request Cluster Scoped ID tokens,
 * which can be passed to a suitably-configured Pinniped Concierge in exchange for x509 client cert bundles.
 *
 * @public
 */
export type PinnipedSupervisorApi = {
  /**
   * Requests an Cluster Scoped ID Token which can be passed to a suitably-configured Pinniped Concierge in exchange for x509 client cert bundles.
   *
   * If the user has not yet logged in to Pinniped inside Backstage, the user will be prompted
   * to log in. The returned promise will not resolve until the user has successfully logged in.
   * The returned promise can be rejected, but only if the user rejects the login request.
   */
  getClusterScopedIdToken(
    audience: string,
    options?: AuthRequestOptions,
  ): Promise<string>;
};

/**
 * Provides Cluster-scoped ID tokens from a Pinniped Supervisor for use with the TokenCredentialRequest API
 *
 * @public
 * @remarks
 *
 * See {@link https://pinniped.dev/docs/howto/configure-auth-for-webapps/#how-a-web-application-can-perform-actions-as-the-authenticated-user-on-kubernetes-clusters} for details.
 */
export const pinnipedSupervisorAuthApiRef: ApiRef<PinnipedSupervisorApi> =
  createApiRef({
    id: 'core.auth.pinniped',
  });
