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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { PropsWithChildren, useMemo } from 'react';
import {
  AutoLogoutProvider,
  AutoLogoutProviderProps,
  AutoLogoutTrackableEvent,
} from './AutoLogoutProvider';
import React from 'react';

export type ConfigBasedAutoLogoutProviderProps = {};

/**
 * A config based flavour of the AutoLogoutProvider.
 * It allows to configure Autologout settings through `app-config`
 */
export const ConfigBasedAutoLogoutProvider = ({
  children,
}: PropsWithChildren<ConfigBasedAutoLogoutProviderProps>): JSX.Element => {
  const configApi = useApi(configApiRef);

  const props: AutoLogoutProviderProps = useMemo(() => {
    return {
      enabled: configApi.getOptionalBoolean('auth.autologout.enabled'),
      idleTimeoutMinutes: configApi.getOptionalNumber(
        'auth.autologout.idleTimeoutMinutes',
      ),
      promptBeforeIdleSeconds: configApi.getOptionalNumber(
        'auth.autologout.promptBeforeIdleSeconds',
      ),
      useWorkerTimers: configApi.getOptionalBoolean(
        'auth.autologout.useWorkerTimers',
      ),
      events: configApi
        .getOptionalStringArray('auth.autologout.events')
        ?.map(event => event as AutoLogoutTrackableEvent),
      logoutIfDisconnected: configApi.getOptionalBoolean(
        'auth.autologout.logoutIfDisconnected',
      ),
    };
  }, [configApi]);

  return (
    <AutoLogoutProvider {...{ ...props, enabled: props.enabled ?? false }}>
      {children}
    </AutoLogoutProvider>
  );
};
