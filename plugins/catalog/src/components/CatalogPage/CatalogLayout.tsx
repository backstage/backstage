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

import React, { FC } from 'react';
import {
  Header,
  HomepageTimer,
  Page,
  pageTheme,
  identityApiRef,
  useApi,
} from '@backstage/core';
import { getTimeBasedGreeting } from './utils/timeUtil';

const CatalogLayout: FC<{}> = props => {
  const { children } = props;
  const greeting = getTimeBasedGreeting();
  const identityApi = useApi(identityApiRef);

  return (
    <Page theme={pageTheme.home}>
      <Header
        title={`${greeting.greeting}, ${identityApi.getUserId()}!`}
        subtitle="Backstage Service Catalog"
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
