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
import { useAsync } from 'react-use';
import { Alert } from '@material-ui/lab';
import { useApi, ContentHeader } from '@backstage/core';

import {
  ComponentConfig,
  ComponentConfigCreateRc,
  ComponentConfigPatch,
  ComponentConfigPromoteRc,
} from './types/types';
import { Cards } from './cards/Cards';
import { CenteredCircularProgress } from './components/CenteredCircularProgress';
import { githubReleaseManagerApiRef } from './api/serviceApiRef';
import { InfoCardPlus } from './components/InfoCardPlus';
import { isProjectValid } from './helpers/isProjectValid';
import { PluginApiClientContext } from './contexts/PluginApiClientContext';
import { ProjectContext, Project } from './contexts/ProjectContext';
import { RepoDetailsForm } from './cards/RepoDetailsForm/RepoDetailsForm';
import { useQueryHandler } from './hooks/useQueryHandler';
import { useStyles } from './styles/styles';

export interface GitHubReleaseManagerProps {
  project?: Omit<Project, 'isProvidedViaProps'>;
  components?: {
    info?: Pick<ComponentConfig<void>, 'omit'>;
    createRc?: ComponentConfigCreateRc;
    promoteRc?: ComponentConfigPromoteRc;
    patch?: ComponentConfigPatch;
  };
}

export function GitHubReleaseManager(props: GitHubReleaseManagerProps) {
  const pluginApiClient = useApi(githubReleaseManagerApiRef);
  const classes = useStyles();

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

  const usernameResponse = useAsync(() =>
    pluginApiClient.getUsername({ owner: project.owner, repo: project.repo }),
  );

  if (usernameResponse.error) {
    return <Alert severity="error">{usernameResponse.error.message}</Alert>;
  }

  if (usernameResponse.loading) {
    return <CenteredCircularProgress />;
  }

  if (!usernameResponse.value?.username) {
    return <Alert severity="error">Unable to retrieve username</Alert>;
  }

  return (
    <PluginApiClientContext.Provider value={{ pluginApiClient }}>
      <ProjectContext.Provider value={{ project }}>
        <div className={classes.root}>
          <ContentHeader title="GitHub Release Manager" />

          <InfoCardPlus>
            <RepoDetailsForm username={usernameResponse.value.username} />
          </InfoCardPlus>

          {isProjectValid(project) && <Cards components={props.components} />}
        </div>
      </ProjectContext.Provider>
    </PluginApiClientContext.Provider>
  );
}
