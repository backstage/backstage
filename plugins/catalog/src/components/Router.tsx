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
import React, { ComponentType } from 'react';
import { CatalogPage } from './CatalogPage';
import { EntityPageLayout } from './EntityPageLayout';
import { Route, Routes } from 'react-router';
import { entityRoute, rootRoute } from '../routes';
import { Content } from '@backstage/core';
import { Typography, Link } from '@material-ui/core';
import { EntityProvider } from './EntityProvider';
import { useEntity } from '../hooks/useEntity';

const DefaultEntityPage = () => (
  <EntityPageLayout>
    <EntityPageLayout.Content
      path="/"
      title="Overview"
      element={
        <Content>
          <Typography variant="h2">This is default entity page. </Typography>
          <Typography variant="body1">
            To override this component with your custom implementation, read
            docs on{' '}
            <Link target="_blank" href="https://backstage.io/docs">
              backstage.io/docs
            </Link>
          </Typography>
        </Content>
      }
    />
  </EntityPageLayout>
);

const EntityPageSwitch = ({ EntityPage }: { EntityPage: ComponentType }) => {
  const { entity } = useEntity();
  // Loading and error states
  if (!entity) return <EntityPageLayout />;

  // Otherwise EntityPage provided from the App
  // Note that EntityPage will include EntityPageLayout already
  return <EntityPage />;
};

export const Router = ({
  EntityPage = DefaultEntityPage,
}: {
  EntityPage?: ComponentType;
}) => (
  <Routes>
    <Route path={`/${rootRoute.path}`} element={<CatalogPage />} />
    <Route
      path={`/${entityRoute.path}`}
      element={
        <EntityProvider>
          <EntityPageSwitch EntityPage={EntityPage} />
        </EntityProvider>
      }
    />
  </Routes>
);
