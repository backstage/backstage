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
  coreExtensionData,
  createFrontendModule,
  identityApiRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { CreateAppOptions, createApp } from './createApp';
import appPlugin from '@backstage/plugin-app';

// This is a copy of the CookieAuthRedirect component from the auth-react
// plugin, to avoid a dependency on that package. Long-term we want this to be
// the only implementation and remove the one in auth-react once the old frontend system is gone.

// TODO(Rugvip): Should this be part of the app plugin instead? since it owns the backend part of it.

/** @internal */
export function InternalCookieAuthRedirect() {
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

/**
 * Creates an app that is suitable for the public sign-in page, for use in the `index-public-experimental.tsx` file.
 *
 * @remarks
 *
 * This app has an override for the `app/layout` extension, which means that
 * most extension typically installed in an app will be ignored. However, you
 * can still for example install API and root element extensions.
 *
 * A typical setup of this app will only install a custom sign-in page.
 *
 * @example
 * ```ts
 * const app = createPublicSignInApp({
 *   features: [signInPageModule],
 * });
 * ```
 *
 * @public
 */
export function createPublicSignInApp(options?: CreateAppOptions) {
  return createApp({
    ...options,
    features: [
      ...(options?.features ?? []),
      // This is a rather than app plugin override in order for it to take precedence over any supplied app plugin override
      createFrontendModule({
        pluginId: 'app',
        extensions: [
          appPlugin.getExtension('app/layout').override({
            factory: () => [
              coreExtensionData.reactElement(<InternalCookieAuthRedirect />),
            ],
          }),
        ],
      }),
    ],
  });
}
