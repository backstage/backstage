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
  errorApiRef,
  fetchApiRef,
  SignInPageProps,
  useApi,
} from '@backstage/core-plugin-api';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { ErrorPanel } from '../../components/ErrorPanel';
import { Progress } from '../../components/Progress';
import { DelegatedSignInIdentity } from './DelegatedSignInIdentity';

/**
 * Props for {@link DelegatedSignInPage}.
 *
 * @public
 */
export type DelegatedSignInPageProps = SignInPageProps & {
  /**
   * The provider to use, e.g. "gcp-iap" or "aws-alb". This must correspond to
   * a properly configured auth provider ID in the auth backend.
   */
  provider: string;
};

/**
 * A sign-in page that has no user interface of its own. Instead, it delegates
 * sign-in to some reverse authenticating proxy that Backstage is deployed
 * behind, and leverages its session handling.
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
export const DelegatedSignInPage = (props: DelegatedSignInPageProps) => {
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const errorApi = useApi(errorApiRef);

  const { loading, error } = useAsync(async () => {
    const identity = new DelegatedSignInIdentity({
      provider: props.provider,
      refreshFrequencyMillis: 60_000,
      retryRefreshFrequencyMillis: 10_000,
      errorApi,
      discoveryApi,
      fetchApi,
    });

    await identity.start();

    props.onSignInSuccess(identity);
  }, []);

  if (loading) {
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
