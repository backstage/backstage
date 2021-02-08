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
import { Entity } from '@backstage/catalog-model';
import {
  configApiRef,
  EmptyState,
  errorApiRef,
  InfoCard,
  Table,
  useApi,
} from '@backstage/core';
import { readGitHubIntegrationConfigs } from '@backstage/integration';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Button, Link } from '@material-ui/core';
import React, { useEffect } from 'react';
import { generatePath, Link as RouterLink } from 'react-router-dom';
import { GITHUB_ACTIONS_ANNOTATION } from '../useProjectName';
import { useWorkflowRuns } from '../useWorkflowRuns';
import { WorkflowRunStatus } from '../WorkflowRunStatus';

const firstLine = (message: string): string => message.split('\n')[0];

export type Props = {
  /** @deprecated The entity is now grabbed from context instead */
  entity?: Entity;
  branch?: string;
  dense?: boolean;
  limit?: number;
  variant?: string;
};

export const RecentWorkflowRunsCard = ({
  branch,
  dense = false,
  limit = 5,
  variant,
}: Props) => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const errorApi = useApi(errorApiRef);
  // TODO: Get github hostname from metadata annotation
  const hostname = readGitHubIntegrationConfigs(
    config.getOptionalConfigArray('integrations.github') ?? [],
  )[0].host;
  const [owner, repo] = (
    entity?.metadata.annotations?.[GITHUB_ACTIONS_ANNOTATION] ?? '/'
  ).split('/');
  const [{ runs = [], loading, error }] = useWorkflowRuns({
    hostname,
    owner,
    repo,
    branch,
    initialPageSize: limit,
  });
  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return !runs.length ? (
    <EmptyState
      missing="data"
      title="No Workflow Data"
      description="This component has GitHub Actions enabled, but no data was found. Have you created any Workflows? Click the button below to create a new Workflow."
      action={
        <Button
          variant="contained"
          color="primary"
          href={`https://github.com/${owner}/${repo}/actions/new`}
        >
          Create new Workflow
        </Button>
      }
    />
  ) : (
    <InfoCard
      title="Recent Workflow Runs"
      subheader={branch ? `Branch: ${branch}` : 'All Branches'}
      noPadding
      variant={variant}
    >
      <Table
        isLoading={loading}
        options={{
          search: false,
          paging: false,
          padding: dense ? 'dense' : 'default',
          toolbar: false,
        }}
        columns={[
          {
            title: 'Commit Message',
            field: 'message',
            render: data => (
              <Link
                component={RouterLink}
                to={generatePath('./ci-cd/:id', { id: data.id! })}
              >
                {firstLine(data.message)}
              </Link>
            ),
          },
          { title: 'Branch', field: 'source.branchName' },
          { title: 'Status', field: 'status', render: WorkflowRunStatus },
        ]}
        data={runs}
      />
    </InfoCard>
  );
};
