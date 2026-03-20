/*
 * Copyright 2026 The Backstage Authors
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

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  useTechDocsAddons,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';
import capitalize from 'lodash/capitalize';

/**
 * Shared hook for TechDocs reader header data.
 * Encapsulates title/subtitle sync, tab title computation,
 * 404 detection, and source link visibility.
 */
export function useTechDocsReaderHeaderData() {
  const addons = useTechDocsAddons();
  const configApi = useApi(configApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const { '*': path = '' } = useParams();

  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    entityRef,
    metadata: { value: metadata, loading: metadataLoading },
    entityMetadata: { value: entityMetadata, loading: entityMetadataLoading },
  } = useTechDocsReaderPage();

  useEffect(() => {
    if (!metadata) return;
    setTitle(metadata.site_name);
    setSubtitle(() => {
      let { site_description } = metadata;
      if (!site_description || site_description === 'None') {
        site_description = '';
      }
      return site_description;
    });
  }, [metadata, setTitle, setSubtitle]);

  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const locationMetadata = entityMetadata?.locationMetadata;
  const showSourceLink =
    !!locationMetadata &&
    locationMetadata.type !== 'dir' &&
    locationMetadata.type !== 'file';

  const noEntMetadata = !entityMetadataLoading && entityMetadata === undefined;
  const noTdMetadata = !metadataLoading && metadata === undefined;
  const hidden = noEntMetadata || noTdMetadata;

  const removeTrailingSlash = (str: string) => str.replace(/\/$/, '');
  const normalizeAndSpace = (str: string) =>
    str.replace(/[-_]/g, ' ').split(' ').map(capitalize).join(' ');

  let tabTitle = appTitle;
  if (!hidden) {
    const stringEntityRef = stringifyEntityRef(entityRef);
    const entityDisplayName =
      entityPresentationApi.forEntity(stringEntityRef).snapshot.primaryTitle;

    let techdocsTabTitleItems: string[] = [];
    if (path !== '')
      techdocsTabTitleItems = removeTrailingSlash(path)
        .split('/')
        .map(normalizeAndSpace);

    const tabTitleItems = [
      entityDisplayName,
      ...techdocsTabTitleItems,
      appTitle,
    ];
    tabTitle = tabTitleItems.join(' | ');
  }

  return {
    title,
    subtitle,
    entityRef,
    entityMetadata,
    tabTitle,
    hidden,
    showSourceLink,
    sourceLink: locationMetadata?.target,
    addons,
  };
}
