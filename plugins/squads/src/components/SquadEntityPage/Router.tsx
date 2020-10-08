import React, { ComponentType } from 'react';
import { SquadExplorerPage } from '../SquadExplorerPage';
import { EntityNotFound } from './EntityNotFound';
import { EntityPageLayout } from './EntityPageLayout';
import { Route, Routes } from 'react-router';
import { Content } from '@backstage/core';
import { Typography, Link } from '@material-ui/core';
import { EntityProvider } from './EntityProvider';
import { getEntity } from '@backstage/plugin-squads';
import { relativeEntityRouteRef, relativeExplorerRouteRef } from '../../plugin'



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

  // Getting entity by calling the catalog API
  const { entity, loading, error } = getEntity();


  // Loading and error states
  if (loading) return <EntityPageLayout />;
  if (error || (!loading && !entity)) return <EntityNotFound />;

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
      <Route
        path={relativeExplorerRouteRef.path}
        element={
          <SquadExplorerPage />
        } 
      />
      <Route
        path={relativeEntityRouteRef.path}
        element={
          <EntityProvider>
            <EntityPageSwitch EntityPage={EntityPage} />
          </EntityProvider>
        }
      />
    </Routes>
  );