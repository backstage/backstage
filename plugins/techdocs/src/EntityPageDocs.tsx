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

import {
  Entity,
  getCompoundEntityRef,
  parseEntityRef,
} from '@backstage/catalog-model';

import React from 'react';
import { TechDocsReaderPage } from './plugin';
import { TechDocsReaderPageContent } from './reader/components/TechDocsReaderPageContent';
import { TechDocsReaderPageSubheader } from './reader/components/TechDocsReaderPageSubheader';

const TECHDOCS_EXTERNAL_ANNOTATION = 'backstage.io/techdocs-entity';

type EntityPageDocsProps = { entity: Entity };

export const EntityPageDocs = ({ entity }: EntityPageDocsProps) => {
  let entityRef = getCompoundEntityRef(entity);

  if (entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]) {
    try {
      entityRef = parseEntityRef(
        entity.metadata.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION],
      );
    } catch {
      // not a fan of this but we don't care if the parseEntityRef fails
    }
  }

  return (
    <TechDocsReaderPage entityRef={entityRef}>
      <TechDocsReaderPageSubheader />
      <TechDocsReaderPageContent withSearch={false} />
    </TechDocsReaderPage>
  );
};
