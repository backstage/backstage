/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';
import { useApi } from '@backstage/core-plugin-api';
import { ContentHeader, Progress } from '@backstage/core-components';

import {
  ComponentConfig,
  CreateRcOnSuccessArgs,
  PatchOnSuccessArgs,
  PromoteRcOnSuccessArgs,
} from './types/types';
import { Features } from './features/Features';
import { gitReleaseManagerApiRef } from './api/serviceApiRef';
import { InfoCardPlus } from './components/InfoCardPlus';
import { isProjectValid } from './helpers/isProjectValid';
import { ProjectContext, Project } from './contexts/ProjectContext';
import { RepoDetailsForm } from './features/RepoDetailsForm/RepoDetailsForm';
import { useQueryHandler } from './hooks/useQueryHandler';
import { UserContext } from './contexts/UserContext';
import {
  GetBranchResult,
  GetLatestReleaseResult,
  GetRepositoryResult,
} from './api/GitReleaseClient';

interface GitReleaseManagerProps {
  project?: Omit<Project, 'isProvidedViaProps'>;
  features?: {
    info?: Pick<ComponentConfig<void>, 'omit'>;
    stats?: Pick<ComponentConfig<void>, 'omit'>;
    createRc?: ComponentConfig<CreateRcOnSuccessArgs>;
    promoteRc?: ComponentConfig<PromoteRcOnSuccessArgs>;
    patch?: ComponentConfig<PatchOnSuccessArgs>;
    custom?: {
      factory: ({
        latestRelease,
        project,
        releaseBranch,
        repository,
      }: {
        latestRelease: GetLatestReleaseResult['latestRelease'] | null;
        project: Project;
        releaseBranch: GetBranchResult['branch'] | null;
        repository: GetRepositoryResult['repository'];
      }) => React.ReactElement | React.ReactElement[];
    };
  };
}

export function GitReleaseManager(props: GitReleaseManagerProps) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);

  const { getParsedQuery } = useQueryHandler();
  const { parsedQuery } = getParsedQuery();
  const project: Project = isProjectValid(props.project)
    ? {
        ...props.project,
        isProvidedViaProps: true,
      }
    : {
        owner: parsedQuery.owner ?? '',
        repo: parsedQuery.repo ?? '',
        versioningStrategy: parsedQuery.versioningStrategy ?? 'semver',
        isProvidedViaProps: false,
      };

  const userResponse = useAsync(() =>
    pluginApiClient.getUser({ owner: project.owner, repo: project.repo }),
  );

  if (userResponse.error) {
    return <Alert severity="error">{userResponse.error.message}</Alert>;
  }

  if (userResponse.loading) {
    return <Progress />;
  }

  if (!userResponse.value?.user.username) {
    return <Alert severity="error">Unable to retrieve username</Alert>;
  }

  const user = userResponse.value.user;

  return (
    <ProjectContext.Provider value={{ project }}>
      <UserContext.Provider value={{ user }}>
        <Box maxWidth={999}>
          <ContentHeader title="Git Release Manager" />

          <InfoCardPlus>
            <RepoDetailsForm />
          </InfoCardPlus>

          {isProjectValid(project) && <Features features={props.features} />}
        </Box>
      </UserContext.Provider>
    </ProjectContext.Provider>
  );
}
