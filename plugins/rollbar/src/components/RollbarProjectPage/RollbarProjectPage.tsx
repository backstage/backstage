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

import React from 'react';
import { Content, Header, HeaderLabel, Page, pageTheme } from '@backstage/core';
import { useCatalogEntity } from '../../hooks/useCatalogEntity';
import { RollbarProject } from '../RollbarProject/RollbarProject';

export const RollbarProjectPage = () => {
  const { entity } = useCatalogEntity();

  return (
    <Page theme={pageTheme.tool}>
      <Header title={entity?.metadata?.name} subtitle="Rollbar Project">
        <HeaderLabel label="Owner" value={entity?.spec?.owner} />
        <HeaderLabel label="Lifecycle" value={entity?.spec?.lifecycle} />
      </Header>
      <Content>
        {entity ? <RollbarProject entity={entity} /> : 'Loading'}
      </Content>
    </Page>
  );
};
