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
import React, { useEffect } from 'react';
import { usePullRequests } from '../usePullRequests';
import { PullRequestsTable } from '../PullRequestsTable';
import { Entity } from '@backstage/catalog-model';
import { LinearProgress, Typography } from '@material-ui/core';
import { InfoCard, errorApiRef, useApi } from '@backstage/core';

const WidgetContent = ({
  error,
  loading,
  branch,
}: {
  error?: Error;
  loading?: boolean;
  branch: string;
}) => {
  if (error) return <Typography>Couldn't fetch latest {branch} run</Typography>;
  if (loading) return <LinearProgress />;
  return <PullRequestsTable />;
};

export const Widget = ({ entity }: { entity: Entity }) => {
  const errorApi = useApi(errorApiRef);
  const [owner, repo] = (
    entity?.metadata.annotations?.['github.com/project-slug'] ?? '/'
  ).split('/');
  const branch =
    entity?.metadata.annotations?.['github.com/project-slug-branch'] ||
    'master';
  const [{ loading, error }] = usePullRequests({
    owner,
    repo,
    branch,
  });
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return (
    <InfoCard title={`Last ${branch} build`}>
      <WidgetContent error={error} loading={loading} branch={branch} />
    </InfoCard>
  );
};
