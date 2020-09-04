import React from 'react';
import { Routes, Route } from 'react-router';
import { circleCIRouteRef, circleCIBuildRouteRef } from '../route-refs';
import { BuildWithStepsPage } from './BuildWithStepsPage/';
import { BuildsPage } from './BuildsPage';
import { CIRCLECI_ANNOTATION } from '../constants';
import { Entity } from '@backstage/catalog-model';
import { WarningPanel } from '@backstage/core';

export const isPluginApplicableToEntity = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[CIRCLECI_ANNOTATION]) &&
  entity.metadata.annotations?.[CIRCLECI_ANNOTATION] !== '';

export const Router = ({ entity }: { entity: Entity }) =>
  !isPluginApplicableToEntity(entity) ? (
    <WarningPanel title="CircleCI plugin:">
      `entity.metadata.annotations['{CIRCLECI_ANNOTATION}']` key is missing on
      the entity.
    </WarningPanel>
  ) : (
    <Routes>
      <Route path={`/${circleCIRouteRef.path}`} element={<BuildsPage />} />
      <Route
        path={`/${circleCIBuildRouteRef.path}`}
        element={<BuildWithStepsPage />}
      />
    </Routes>
  );
