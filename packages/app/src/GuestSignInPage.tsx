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

import { useEffect, useState } from 'react';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ProxiedSignInIdentity } from '../../core-components/src/layout/ProxiedSignInPage/ProxiedSignInIdentity';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { GuestUserIdentity } from '../../core-components/src/layout/SignInPage/GuestUserIdentity';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { createFrontendModule } from '@backstage/frontend-plugin-api';

function AutoGuestSignInPage({
  onSignInSuccess,
}: {
  onSignInSuccess: (identityApi: any) => void;
}) {
  const discoveryApi = useApi(discoveryApiRef);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const identity = new ProxiedSignInIdentity({
      provider: 'guest',
      discoveryApi,
    });

    identity
      .start()
      .then(() => onSignInSuccess(identity))
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn(
          'Guest backend auth failed, falling back to legacy guest token:',
          err.message,
        );
        onSignInSuccess(new GuestUserIdentity());
      });
  }, [discoveryApi, onSignInSuccess]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Guest sign-in failed: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Signing in as guest...</p>
    </div>
  );
}

export const guestSignInPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    SignInPageBlueprint.make({
      params: {
        loader: async () => props => <AutoGuestSignInPage {...props} />,
      },
    }),
  ],
});
