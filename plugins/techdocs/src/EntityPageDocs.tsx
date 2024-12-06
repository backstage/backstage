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
import { TECHDOCS_EXTERNAL_ANNOTATION } from '@backstage/plugin-techdocs-common';

import { TechDocsReaderPage } from './plugin';
import { TechDocsReaderPageContent } from './reader/components/TechDocsReaderPageContent';
import { TechDocsReaderPageSubheader } from './reader/components/TechDocsReaderPageSubheader';
import { useEntityPageTechDocsRedirect } from './search/hooks/useTechDocsLocation';

type EntityPageDocsProps = {
  entity: Entity;
  /**
   * Show or hide the content search bar, defaults to true.
   */
  withSearch?: boolean;
};

export const EntityPageDocs = ({
  entity,
  withSearch = true,
}: EntityPageDocsProps) => {
  let entityRef = getCompoundEntityRef(entity);

  const searchResultUrlMapper = useEntityPageTechDocsRedirect(entityRef);

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
      <TechDocsReaderPageContent
        withSearch={withSearch}
        searchResultUrlMapper={searchResultUrlMapper}
      />
    </TechDocsReaderPage>
  );
};
