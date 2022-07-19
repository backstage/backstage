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

import { Entity, getCompoundEntityRef } from '@backstage/catalog-model';

import { TechDocsReaderPage } from './plugin';
import { TechDocsReaderPageSubheader } from './reader/components/TechDocsReaderPageSubheader';
import { TechDocsReaderPageContent } from './reader/components/TechDocsReaderPageContent';

type EntityPageDocsProps = { entity: Entity };

export const EntityPageDocs = ({ entity }: EntityPageDocsProps) => {
  const entityRef = getCompoundEntityRef(entity);

  return (
    <TechDocsReaderPage entityRef={entityRef}>
      <TechDocsReaderPageSubheader />
      <TechDocsReaderPageContent withSearch={false} />
    </TechDocsReaderPage>
  );
};
