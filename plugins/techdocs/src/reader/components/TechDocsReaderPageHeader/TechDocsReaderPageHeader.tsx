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

import React, { FC, useEffect } from 'react';
import Helmet from 'react-helmet';

import { Skeleton } from '@material-ui/lab';
import CodeIcon from '@material-ui/icons/Code';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
} from '@backstage/techdocs-addons';
import {
  EntityRefLink,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { Header, HeaderLabel } from '@backstage/core-components';
import { useRouteRef, configApiRef, useApi } from '@backstage/core-plugin-api';

import {
  useTechDocsReaderPage,
  useTechDocsMetadata,
  useEntityMetadata,
} from '../TechDocsReaderPage';

import { rootRouteRef } from '../../../routes';

const skeleton = <Skeleton animation="wave" variant="text" height={40} />;

export const TechDocsReaderPageHeader: FC = ({ children }) => {
  const addons = useTechDocsAddons();
  const configApi = useApi(configApiRef);

  const { value: entityMetadata } = useEntityMetadata();
  const { value: techDocsMetadata } = useTechDocsMetadata();

  const {
    title,
    setTitle,
    subtitle,
    setSubtitle,
    entityName: entityRef,
  } = useTechDocsReaderPage();

  useEffect(() => {
    if (!techDocsMetadata) return;
    setTitle(prevTitle => {
      const { site_name } = techDocsMetadata;
      return prevTitle || site_name;
    });
    setSubtitle(prevSubtitle => {
      let { site_description } = techDocsMetadata;
      if (site_description === 'None') {
        site_description = 'Home';
      }
      return prevSubtitle || site_description;
    });
  }, [techDocsMetadata, setTitle, setSubtitle]);

  const appTitle = configApi.getOptional('app.title') || 'Backstage';
  const tabTitle = [subtitle, title, appTitle].filter(Boolean).join(' | ');

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
      {addons.renderComponentsByLocation(locations.HEADER)}
    </Header>
  );
};
