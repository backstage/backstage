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

import React, { PropsWithChildren, useEffect } from 'react';
import Helmet from 'react-helmet';

import { Skeleton } from '@material-ui/lab';
import CodeIcon from '@material-ui/icons/Code';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
  useTechDocsReaderPage,
  TechDocsEntityMetadata,
  TechDocsMetadata,
} from '@backstage/plugin-techdocs-react';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY, CompoundEntityRef } from '@backstage/catalog-model';
import { Header, HeaderLabel } from '@backstage/core-components';
import { useRouteRef, configApiRef, useApi } from '@backstage/core-plugin-api';

import { rootRouteRef } from '../../../routes';

const skeleton = <Skeleton animation="wave" variant="text" height={40} />;

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
    setTitle(prevTitle => {
      const { site_name } = metadata;
      return prevTitle || site_name;
    });
    setSubtitle(prevSubtitle => {
      let { site_description } = metadata;
      if (!site_description || site_description === 'None') {
        site_description = 'Home';
      }
      return prevSubtitle || site_description;
    });
  }, [metadata, setTitle, setSubtitle]);

  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const tabTitle = [title, subtitle, appTitle].filter(Boolean).join(' | ');

  const { locationMetadata, spec } = entityMetadata || {};
  const lifecycle = spec?.lifecycle;

  const ownedByRelations = entityMetadata
    ? getEntityRelations(entityMetadata, RELATION_OWNED_BY)
    : [];

  const docsRootLink = useRouteRef(rootRouteRef)();

  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <EntityRefLink
            color="inherit"
            entityRef={entityRef}
            title={entityMetadata?.metadata.title}
            defaultKind="Component"
          />
        }
      />
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label="Owner"
          value={
            <EntityRefLinks
              color="inherit"
              entityRefs={ownedByRelations}
              defaultKind="group"
            />
          }
        />
      )}
      {lifecycle ? <HeaderLabel label="Lifecycle" value={lifecycle} /> : null}
      {locationMetadata &&
      locationMetadata.type !== 'dir' &&
      locationMetadata.type !== 'file' ? (
        <HeaderLabel
          label=""
          value={
            <a
              href={locationMetadata.target}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CodeIcon style={{ marginTop: '-25px', fill: '#fff' }} />
            </a>
          }
        />
      ) : null}
    </>
  );

  // If there is no entity or techdocs metadata, there's no reason to show the
  // header (hides the header on 404 error pages).
  const noEntMetadata = !entityMetadataLoading && entityMetadata === undefined;
  const noTdMetadata = !metadataLoading && metadata === undefined;
  if (noEntMetadata || noTdMetadata) return null;

  return (
    <Header
      type="Documentation"
      typeLink={docsRootLink}
      title={title || skeleton}
      subtitle={subtitle || skeleton}
    >
      <Helmet titleTemplate="%s">
        <title>{tabTitle}</title>
      </Helmet>
      {labels}
      {children}
      {addons.renderComponentsByLocation(locations.Header)}
    </Header>
  );
};
