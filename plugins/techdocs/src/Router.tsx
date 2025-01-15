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

import React, { PropsWithChildren } from 'react';
import { Route, Routes, useRoutes } from 'react-router-dom';

import { Entity } from '@backstage/catalog-model';
import { EntityPageDocs } from './EntityPageDocs';
import { TechDocsIndexPage } from './home/components/TechDocsIndexPage';
import { TechDocsReaderPage } from './reader/components/TechDocsReaderPage';
import {
  useEntity,
  MissingAnnotationEmptyState,
} from '@backstage/plugin-catalog-react';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
} from '@backstage/plugin-techdocs-common';

/**
 * Helper that takes in entity and returns true/false if TechDocs is available for the entity
 *
 * @public
 */
export const isTechDocsAvailable = (entity: Entity) =>
  Boolean(entity?.metadata?.annotations?.[TECHDOCS_ANNOTATION]) ||
  Boolean(entity?.metadata?.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]);

/**
 * Responsible for registering routes for TechDocs, TechDocs Homepage and separate TechDocs page
 *
 * @public
 */
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TechDocsIndexPage />} />
      <Route
        path="/:namespace/:kind/:name/*"
        element={<TechDocsReaderPage />}
      />
    </Routes>
  );
};

export const EmbeddedDocsRouter = (
  props: PropsWithChildren<{
    emptyState?: React.ReactElement;
    withSearch?: boolean;
  }>,
) => {
  const { children, emptyState, withSearch = true } = props;
  const { entity } = useEntity();

  // Using objects instead of <Route> elements, otherwise "outlet" will be null on sub-pages and add-ons won't render
  const element = useRoutes([
    {
      path: '/*',
      element: <EntityPageDocs entity={entity} withSearch={withSearch} />,
      children: [
        {
          path: '*',
          element: children,
        },
      ],
    },
  ]);

  const projectId =
    entity.metadata.annotations?.[TECHDOCS_ANNOTATION] ||
    entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION];

  if (!projectId) {
    return (
      emptyState ?? (
        <MissingAnnotationEmptyState annotation={[TECHDOCS_ANNOTATION]} />
      )
    );
  }

  return element;
};

/**
 * Responsible for registering route to view docs on Entity page
 *
 * @public
 */
export const LegacyEmbeddedDocsRouter = ({
  children,
  withSearch = true,
}: PropsWithChildren<{ withSearch?: boolean }>) => {
  // Wrap the Router to avoid exposing the emptyState prop in the non-alpha
  // public API and make it easier for us to change later.
  return <EmbeddedDocsRouter children={children} withSearch={withSearch} />;
};
