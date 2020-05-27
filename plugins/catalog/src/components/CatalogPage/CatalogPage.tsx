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
  Content,
  ContentHeader,
  Header,
  HomepageTimer,
  SupportButton,
  Page,
  pageTheme,
  useApi,
} from '@backstage/core';
import { useAsync } from 'react-use';
import CatalogTable from '../CatalogTable/CatalogTable';
import { Button } from '@material-ui/core';

import { catalogApiRef } from '../..';
import { envelopeToComponent } from '../../data/utils';

const CatalogPage: FC<{}> = () => {
  const catalogApi = useApi(catalogApiRef);
  const { value, error, loading } = useAsync(() => catalogApi.getEntities());

  return (
    <Page theme={pageTheme.home}>
      <Header title="Service Catalog" subtitle="Keep track of your software">
        <HomepageTimer />
      </Header>
      <Content>
        <ContentHeader title="Services">
          <Button variant="contained" color="primary" href="/create">
            Create Service
          </Button>
          <SupportButton>All your components</SupportButton>
        </ContentHeader>
        <CatalogTable
          components={(value && value.map(envelopeToComponent)) || []}
          loading={loading}
          error={error}
        />
      </Content>
    </Page>
  );
};

export default CatalogPage;
