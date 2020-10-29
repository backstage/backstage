/*
 * Copyright 2020 Spotify AB
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
  configApiRef,
  Header,
  HomepageTimer,
  identityApiRef,
  Page,
  useApi,
} from '@backstage/core';
import React from 'react';
import { getTimeBasedGreeting } from './utils/timeUtil';

type Props = {
  children?: React.ReactNode;
};

const CatalogLayout = ({ children }: Props) => {
  const greeting = getTimeBasedGreeting();
  const profile = useApi(identityApiRef).getProfile();
  const userId = useApi(identityApiRef).getUserId();
  const orgName = useApi(configApiRef).getOptionalString('organization.name');

  return (
    <Page themeId="home">
      <Header
        title={`${greeting.greeting}, ${profile.displayName || userId}!`}
        subtitle={`${orgName || 'Backstage'} Service Catalog`}
        tooltip={greeting.language}
        pageTitleOverride="Home"
      >
        <HomepageTimer />
      </Header>
      {children}
    </Page>
  );
};

export default CatalogLayout;
