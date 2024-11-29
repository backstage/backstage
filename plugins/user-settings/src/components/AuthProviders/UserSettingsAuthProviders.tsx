/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import List from '@material-ui/core/List';
import { EmptyProviders } from './EmptyProviders';
import { DefaultProviderSettings } from './DefaultProviderSettings';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { InfoCard } from '@backstage/core-components';

/** @public */
export const UserSettingsAuthProviders = (props: {
  providerSettings?: JSX.Element;
}) => {
  const { providerSettings } = props;
  const configApi = useApi(configApiRef);
  const providersConfig = configApi.getOptionalConfig('auth.providers');
  const configuredProviders = providersConfig?.keys() || [];
  const providers = providerSettings ?? (
    <DefaultProviderSettings configuredProviders={configuredProviders} />
  );

  if (!providerSettings && !configuredProviders?.length) {
    return <EmptyProviders />;
  }

  return (
    <InfoCard title="Available Providers">
      <List dense>{providers}</List>
    </InfoCard>
  );
};
