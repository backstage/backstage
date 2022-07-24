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

import React from 'react';

import {
  CompoundEntityRef,
  Entity,
  getCompoundEntityRef,
} from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { MissingAnnotationEmptyState } from '@backstage/core-components';

import { TechDocsReaderPage } from './plugin';
import { TechDocsReaderPageSubheader } from './reader/components/TechDocsReaderPageSubheader';
import { TechDocsReaderPageContent } from './reader/components/TechDocsReaderPageContent';

const TECHDOCS_ANNOTATION = 'backstage.io/techdocs-ref';

/**
 * Helper that takes in entity and returns true/false if TechDocs is available for the entity
 * @public
 */
export const isTechDocsAvailable = (entity: Entity) =>
  Boolean(entity?.metadata?.annotations?.[TECHDOCS_ANNOTATION]);

/**
 * props for EntityDocsPage.
 * @public
 */
export type EntityDocsPageProps = {
  children: (value: { entityRef: CompoundEntityRef }) => JSX.Element;
};

/**
 * Component for rendering documentation on catalog entity page.
 * @public
 */
export const EntityDocsPage = ({ children }: EntityDocsPageProps) => {
  const { entity } = useEntity();
  const entityRef = getCompoundEntityRef(entity);

  const projectId = entity.metadata.annotations?.[TECHDOCS_ANNOTATION];

  if (!projectId) {
    return <MissingAnnotationEmptyState annotation={TECHDOCS_ANNOTATION} />;
  }

  return children instanceof Function ? children({ entityRef }) : children;
};

/**
 * The default entity docs page.
 * @internal
 */
export const DefaultEntityDocsPage = () => (
  <EntityDocsPage>
    {({ entityRef }) => (
      <TechDocsReaderPage entityRef={entityRef}>
        <TechDocsReaderPageSubheader />
        <TechDocsReaderPageContent withSearch={false} />
      </TechDocsReaderPage>
    )}
  </EntityDocsPage>
);
