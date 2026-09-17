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

import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { useAsync, useMountEffect } from '@react-hookz/web';

/**
 * @public
 * A component that redirects to the page an user was trying to access before sign-in.
 */
export function CookieAuthRedirect() {
  const identityApi = useApi(identityApiRef);

  const [state, actions] = useAsync(async () => {
    const { token } = await identityApi.getCredentials();
    if (!token) {
      throw new Error('Expected Backstage token in sign-in response');
    }
    return token;
  });

  useMountEffect(actions.execute);

  if (state.status === 'error' && state.error) {
    return <>An error occurred: {state.error.message}</>;
  }

  if (state.status === 'success' && state.result) {
    return (
      <form
        ref={form => form?.submit()}
        action={window.location.href}
        method="POST"
        style={{ visibility: 'hidden' }}
      >
        <input type="hidden" name="type" value="sign-in" />
        <input type="hidden" name="token" value={state.result} />
        <input type="submit" value="Continue" />
      </form>
    );
  }

  return null;
}
