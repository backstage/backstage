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
import { AsyncState } from 'react-use/lib/useAsync';
import CodeIcon from '@material-ui/icons/Code';
import { EntityName, parseEntityName } from '@backstage/catalog-model';
import { Header, HeaderLabel, Link, useRouteRef } from '@backstage/core';
import { TechDocsMetadata } from '../../types';
import { EntityRefLink, entityRouteRef } from '@backstage/plugin-catalog-react';

type TechDocsPageHeaderProps = {
  entityId: EntityName;
  metadataRequest: {
    entity: AsyncState<any>;
    techdocs: AsyncState<TechDocsMetadata>;
  };
};

export const TechDocsPageHeader = ({
  entityId,
  metadataRequest,
}: TechDocsPageHeaderProps) => {
  const {
    techdocs: techdocsMetadata,
    entity: entityMetadata,
  } = metadataRequest;

  const { value: techdocsMetadataValues } = techdocsMetadata;
  const { value: entityMetadataValues } = entityMetadata;

  const { name } = entityId;

  const { site_name: siteName, site_description: siteDescription } =
    techdocsMetadataValues || {};

  const {
    locationMetadata,
    spec: { owner, lifecycle },
  } = entityMetadataValues || { spec: {} };

  const componentLink = useRouteRef(entityRouteRef);

  let ownerEntity;
  if (owner) {
    ownerEntity = parseEntityName(owner, { defaultKind: 'group' });
  }

  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <Link style={{ color: '#fff' }} to={componentLink(entityId)}>
            {name}
          </Link>
        }
      />
      {owner ? (
        <HeaderLabel
          label="Owner"
          value={
            ownerEntity ? (
              <EntityRefLink
                style={{ color: '#fff' }}
                entityRef={ownerEntity}
                defaultKind="group"
              />
            ) : (
              owner
            )
          }
        />
      ) : null}
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
      title={siteName ? siteName : '.'}
      pageTitleOverride={siteName || name}
      subtitle={
        siteDescription && siteDescription !== 'None' ? siteDescription : ''
      }
      type={name}
      typeLink={componentLink(entityId)}
    >
      {labels}
    </Header>
  );
};
