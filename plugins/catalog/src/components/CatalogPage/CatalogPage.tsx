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
} from '@backstage/core';
import { useAsync } from 'react-use';
import { ComponentFactory } from '../../data/component';
import CatalogTable from '../CatalogTable/CatalogTable';
import { Button } from '@material-ui/core';

type CatalogPageProps = {
  componentFactory: ComponentFactory;
};
const CatalogPage: FC<CatalogPageProps> = ({ componentFactory }) => {
  const { value, error, loading } = useAsync(componentFactory.getAllComponents);
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
          components={value || []}
          loading={loading}
          error={error}
        />
      </Content>
    </Page>
  );
};

export default CatalogPage;
