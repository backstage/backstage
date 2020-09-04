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
import { Entity } from '@backstage/catalog-model';
import { Routes, Route } from 'react-router';
import { WarningPanel } from '@backstage/core';
import { SentryPluginWidget } from './SentryPluginWidget/SentryPluginWidget';

const SENTRY_ANNOTATION = 'sentry.io/project-slug';

export const Router = ({ entity }: { entity: Entity }) => {
  const projectId = entity.metadata.annotations?.[SENTRY_ANNOTATION];

  if (!projectId) {
    return (
      <WarningPanel title="Sentry plugin:">
        <pre>{SENTRY_ANNOTATION}</pre> annotation is missing on the entity.
      </WarningPanel>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SentryPluginWidget sentryProjectId={projectId} statsFor="24h" />
        }
      />
      )
    </Routes>
  );
};
