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

import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { useAsync } from '@react-hookz/web';
import { deserializeError } from '@backstage/errors';

/**
 * @public
 * A hook that will fetch any sign in auth error in redirect auth flow
 */
export function useSignInAuthError(): {
  error: Error | undefined;
  checkAuthError: () => void;
} {
  const discoveryApi = useApi(discoveryApiRef);

  const [state, { execute: checkAuthError }] = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('auth');

    // use native fetch instead of fetchApi because
    // we are not signed in and are calling an unauthenticated endpoint
    const response = await fetch(`${baseUrl}/.backstage/error`, {
      credentials: 'include',
    });
    const data = await response.json();

    return data ? deserializeError(data) : undefined;
  });

  return { error: state.result, checkAuthError };
}
