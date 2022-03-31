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

import {
  discoveryApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import React from 'react';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { ErrorPanel } from '../../components/ErrorPanel';
import { Progress } from '../../components/Progress';
import { ProxiedSignInIdentity } from './ProxiedSignInIdentity';

/**
 * Props for {@link ProxiedSignInPage}.
 *
 * @public
 */
export type ProxiedSignInPageProps = SignInPageProps & {
  /**
   * The provider to use, e.g. "gcp-iap" or "awsalb". This must correspond to
   * a properly configured auth provider ID in the auth backend.
   */
  provider: string;
};

/**
 * A sign-in page that has no user interface of its own. Instead, it relies on
 * sign-in being performed by a reverse authenticating proxy that Backstage is
 * deployed behind, and leverages its session handling.
 *
 * @remarks
 *
 * This sign-in page is useful when you are using products such as Google
 * Identity-Aware Proxy or AWS Application Load Balancer or similar, to front
 * your Backstage installation. This sign-in page implementation will silently
 * and regularly punch through the proxy to the auth backend to refresh your
 * frontend session information, without requiring user interaction.
 *
 * @public
 */
export const ProxiedSignInPage = (props: ProxiedSignInPageProps) => {
  const discoveryApi = useApi(discoveryApiRef);

  const [{ status, error }, { execute }] = useAsync(async () => {
    const identity = new ProxiedSignInIdentity({
      provider: props.provider,
      discoveryApi,
    });

    await identity.start();

    props.onSignInSuccess(identity);
  });

  useMountEffect(execute);

  if (status === 'loading') {
    return <Progress />;
  } else if (error) {
    return (
      <ErrorPanel
        title="You do not appear to be signed in. Please try reloading the browser page."
        error={error}
      />
    );
  }

  return null;
};
