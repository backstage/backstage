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
import { useParams } from 'react-router-dom';

import { TechDocsPageWrapper } from './TechDocsPageWrapper';
import { Reader } from './Reader';
import { useApi, HeaderLabel, Link } from '@backstage/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import { TechDocsMetadata } from '../../metadata';
import { useAsync } from 'react-use';
import { techdocsStorageApiRef } from '../../api';
import { catalogApiRef } from '@backstage/plugin-catalog';

export const TechDocsPage = () => {
  const { entityId, '*': path } = useParams();
  const catalogApi = useApi(catalogApiRef);
  const [kind, namespace, name] = entityId.split(':');
  const techdocsStorageApi = useApi(techdocsStorageApiRef);
  const optionalNamespace = namespace ? namespace : 'default';
  const techDocsMetadata = new TechDocsMetadata();

  const { value, loading, error } = useAsync(async () => {
    const docsUrl = `http://localhost:7000/api/techdocs/static/docs/${kind}/${optionalNamespace}/${name}`;
    return {
      entityDocs: await techdocsStorageApi.getEntityDocs(
        { kind, namespace, name },
        path,
      ),
      mkDocsMetadata: await techDocsMetadata.getMkDocsMetaData(docsUrl),
      entityMetadata: await catalogApi.getEntityByName({
        kind,
        namespace: optionalNamespace,
        name,
      }),
    };
  }, [kind, namespace, name, path]);

  if (loading || error || !value) return null;

  const { entityDocs, entityMetadata, mkDocsMetadata } = value;

  if (!entityDocs) return null;

  const { metadata, spec } = entityMetadata;

  const repoURL = metadata.annotations['backstage.io/techdocs-ref'].replace(
    'github:',
    '',
  );

  // Header Labels to show additional metadata
  const labels = (
    <>
      <HeaderLabel
        label="Component"
        value={
          <Link style={{ color: '#fff' }} to={`/catalog/${kind}/${name}`}>
            {name}
          </Link>
        }
      />
      <HeaderLabel label="Site Owner" value={spec?.owner} />
      <HeaderLabel label="Lifecycle" value={spec?.lifecycle} />
      <HeaderLabel
        label=""
        value={
          <a href={repoURL} target="_blank">
            <GitHubIcon style={{ marginTop: '-25px', fill: '#fff' }} />
          </a>
        }
      />
    </>
  );

  return (
    <TechDocsPageWrapper
      labels={labels}
      title={mkDocsMetadata.siteName}
      subtitle={
        mkDocsMetadata.siteDescription === 'None' || undefined
          ? ''
          : mkDocsMetadata.siteDescription
      }
    >
      <Reader
        entityId={{
          kind,
          namespace,
          name,
        }}
      />
    </TechDocsPageWrapper>
  );
};
