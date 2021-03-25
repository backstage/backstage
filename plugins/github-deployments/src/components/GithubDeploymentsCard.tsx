/*
 * Copyright 2021 Spotify AB
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
import { LinearProgress } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { InfoCard, MissingAnnotationEmptyState, useApi } from '@backstage/core';
import { useAsync } from 'react-use';
import { githubDeploymentsApiRef } from '../api';
import GithubDeploymentsTable from './GithubDeploymentsTable/GithubDeploymentsTable';

export const GITHUB_PROJECT_SLUG_ANNOTATION = 'github.com/project-slug';

export const isGithubDeploymentsAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION]);

const GithubDeploymentsComponent = ({
  entity,
  last,
}: {
  entity: Entity;
  last: number;
}) => {
  const api = useApi(githubDeploymentsApiRef);
  const annotation =
    entity.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION] ?? '';
  const [owner, repo] = annotation.split('/');

  const { loading, value, error } = useAsync(
    async () => await api.listDeployments({ owner, repo, last }),
  );

  if (loading) {
    return (
      <InfoCard title="Github Deployments">
        <LinearProgress />
      </InfoCard>
    );
  }
  if (error) {
    return (
      <InfoCard title="Github Deployments">
        Error occurred while fetching data.
      </InfoCard>
    );
  }

  return <GithubDeploymentsTable deployments={value || []} />;
};

export const GithubDeploymentsCard = ({
  entity,
  last,
}: {
  entity: Entity;
  last?: number;
}) => {
  return !isGithubDeploymentsAvailable(entity) ? (
    <MissingAnnotationEmptyState annotation={GITHUB_PROJECT_SLUG_ANNOTATION} />
  ) : (
    <GithubDeploymentsComponent entity={entity} last={last || 10} />
  );
};
