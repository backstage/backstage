/*
 * Copyright 2022 The Backstage Authors
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

import { PropsWithChildren, useEffect } from 'react';
import Helmet from 'react-helmet';

import CodeIcon from '@material-ui/icons/Code';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
  useTechDocsReaderPage,
  TechDocsEntityMetadata,
  TechDocsMetadata,
} from '@backstage/plugin-techdocs-react';
import {
  entityPresentationApiRef,
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import {
  RELATION_OWNED_BY,
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { DocsIcon } from '@backstage/core-components';
import { useRouteRef, configApiRef, useApi } from '@backstage/core-plugin-api';
import { HeaderPage, Header, Flex, ButtonLink } from '@backstage/ui';

import { TechDocsHeaderLabel } from '../TechDocsHeaderLabel';

import capitalize from 'lodash/capitalize';

import { rootRouteRef } from '../../../routes';
import { useParams } from 'react-router-dom';

/**
 * Props for {@link TechDocsReaderPageHeader}
 *
 * @public
 * @deprecated No need to pass down properties anymore. The component consumes data from `TechDocsReaderPageContext` instead. Use the {@link @backstage/plugin-techdocs-react#useTechDocsReaderPage} hook for custom header.
 */
export type TechDocsReaderPageHeaderProps = PropsWithChildren<{
  entityRef?: CompoundEntityRef;
  entityMetadata?: TechDocsEntityMetadata;
  techDocsMetadata?: TechDocsMetadata;
}>;

/**
 * Renders the reader page header.
 * This component does not accept props, please use
 * the Tech Docs add-ons to customize it
 * @public
 */
export const TechDocsReaderPageHeader = (
  props: TechDocsReaderPageHeaderProps,
) => {
  const { children } = props;
  const addons = useTechDocsAddons();
  const configApi = useApi(configApiRef);

  const entityPresentationApi = useApi(entityPresentationApiRef);
  const { '*': path = '' } = useParams();

  const {
    title,
    setTitle,
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

  const appTitle = configApi.getOptional('app.title') || 'Backstage';

  const { locationMetadata, spec } = entityMetadata || {};
  const lifecycle = spec?.lifecycle;

  const ownedByRelations = entityMetadata
    ? getEntityRelations(entityMetadata, RELATION_OWNED_BY)
    : [];

  const docsRootLink = useRouteRef(rootRouteRef)();

  const labels = (
    <>
      <TechDocsHeaderLabel label={capitalize(entityMetadata?.kind || 'entity')}>
        <EntityRefLink entityRef={entityRef} defaultKind="Component" />
      </TechDocsHeaderLabel>

      {ownedByRelations.length > 0 && (
        <TechDocsHeaderLabel label="Owner">
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
        </TechDocsHeaderLabel>
      )}

      {lifecycle ? (
        <TechDocsHeaderLabel label="Lifecycle">
          {String(lifecycle)}
        </TechDocsHeaderLabel>
      ) : null}

      {locationMetadata &&
        locationMetadata.type !== 'dir' &&
        locationMetadata.type !== 'file' && (
          <ButtonLink
            href={locationMetadata?.target || ''}
            iconStart={<CodeIcon />}
            variant="tertiary"
            size="small"
          >
            Source
          </ButtonLink>
        )}
    </>
  );

  // If there is no entity or techdocs metadata, there's no reason to show the
  // header (hides the header on 404 error pages).
  const noEntMetadata = !entityMetadataLoading && entityMetadata === undefined;
  const noTdMetadata = !metadataLoading && metadata === undefined;
  if (noEntMetadata || noTdMetadata) return null;

  const stringEntityRef = stringifyEntityRef(entityRef);

  const entityDisplayName =
    entityPresentationApi.forEntity(stringEntityRef).snapshot.primaryTitle;

  const removeTrailingSlash = (str: string) => str.replace(/\/$/, '');
  const normalizeAndSpace = (str: string) =>
    str.replace(/[-_]/g, ' ').split(' ').map(capitalize).join(' ');

  let techdocsTabTitleItems: string[] = [];

  if (path !== '')
    techdocsTabTitleItems = removeTrailingSlash(path)
      .split('/')
      .map(normalizeAndSpace);

  const tabTitleItems = [entityDisplayName, ...techdocsTabTitleItems, appTitle];
  const tabTitle = tabTitleItems.join(' | ');

  return (
    <>
      <div style={{ gridArea: 'pageHeader' }}>
        <Helmet titleTemplate="%s">
          <title>{tabTitle}</title>
        </Helmet>
        <Header
          icon={<DocsIcon fontSize="inherit" />}
          title="TechDocs"
          titleLink={docsRootLink}
        />
        <HeaderPage
          title={title || 'Documentation'}
          breadcrumbs={[{ label: 'Documentation', href: docsRootLink }]}
          customActions={
            <Flex gap="8" align="start">
              {labels}
            </Flex>
          }
        />
      </div>
      {children}
      {addons.renderComponentsByLocation(locations.Header)}
    </>
  );
};
