/*
 * Copyright 2023 The Backstage Authors
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
import { Entity, RELATION_HAS_PART, RELATION_OWNER_OF } from '@backstage/catalog-model';
import { Content, Page, Progress } from '@backstage/core-components';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { parseGerritJsonResponse } from '@backstage/integration';
import { useEntity, useRelatedEntities } from '@backstage/plugin-catalog-react';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { DenseTable } from '../GerritReviews/GerritReviews';

export const GERRIT_ANNOTATION = "gerrit/component"

async function getEntityPartRepo(entities: Entity[] | undefined) {
  let entityPartRepo: string = '';
  if (entities && entities.length > 0) {
    for (const entityPart of entities) {
      entityPartRepo = `${entityPartRepo}&q=project:${entityPart.metadata?.annotations?.[GERRIT_ANNOTATION]}`;
    };
  }
  return entityPartRepo;
}

const GetGerritReviews = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const { entity } = useEntity();
  let relationType: string | undefined
  let repoView: boolean = false;

  if (entity.kind === "System")
    relationType = RELATION_HAS_PART
  else if (entity.kind === "Group")
    relationType = RELATION_OWNER_OF
  else repoView = true

  const { entities } = useRelatedEntities(entity, { type: relationType, kind: "Component"})
  const [entityPartRepo, setEntityPartRepo] = useState('');

  useEffect(() => {
    const fetchEntityPartRepo = async () => {
      const repo = await getEntityPartRepo(entities);
      setEntityPartRepo(repo);
    };
    fetchEntityPartRepo();
  }, [entities]);

  let gerritRepo: string = '';
  let gerritRepoSearch: string = '';
  if (entity?.metadata?.annotations?.[GERRIT_ANNOTATION]) {
    gerritRepo = entity?.metadata?.annotations?.[GERRIT_ANNOTATION];
    gerritRepoSearch = `&q=project:${gerritRepo}`;
  }

  const { value = [], loading, error } = useAsync(async () => {
    const proxyBackendBaseUrl = await discoveryApi.getBaseUrl('proxy');
    const request = `changes/?O=81&S=0&n=50${gerritRepoSearch}${entityPartRepo}`;
    const gerritResponse = await fetch(
      `${proxyBackendBaseUrl}/gerrit/a/${request}`
    );

    if (!gerritResponse.ok) {
      throw new Error(gerritResponse.statusText);
    }
    return await parseGerritJsonResponse(gerritResponse as any) as any;
  }, [entityPartRepo, gerritRepo, discoveryApi]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  const flattenedValue = value.flatMap((item: Array<{ [key: string]: string }>) => item);

  return (
    <DenseTable
      gerritChangesList={flattenedValue}
      tableTitle={gerritRepo}
      repoView={repoView}
    />
  );
};

export const GerritReviews = () => (
  <Page themeId="tool">
    <Content>
        <Grid item>
          <GetGerritReviews />
      </Grid>
    </Content>
  </Page>
);
