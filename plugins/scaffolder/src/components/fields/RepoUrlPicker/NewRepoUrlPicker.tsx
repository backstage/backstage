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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useApi } from '@backstage/core-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import React, { useEffect, useState } from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { GitlabRepoPicker } from './GitlabRepoPicker';
import { AzureRepoPicker } from './AzureRepoPicker';
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { CustomFieldExtension } from '../../../extensions';
import { RepoUrlPickerHost } from './RepoUrlPickerHost';

export interface RepoUrlPickerUiOptions {
  allowedHosts?: string[];
  allowedOwners?: string[];
}

function serializeFormData(data: {
  host?: string;
  owner?: string;
  repo?: string;
  organization?: string;
  workspace?: string;
  project?: string;
}) {
  if (!data.host) {
    return undefined;
  }

  const params = new URLSearchParams();
  if (data.owner) {
    params.set('owner', data.owner);
  }
  if (data.repo) {
    params.set('repo', data.repo);
  }
  if (data.organization) {
    params.set('organization', data.organization);
  }
  if (data.workspace) {
    params.set('workspace', data.workspace);
  }
  if (data.project) {
    params.set('project', data.project);
  }

  return `${data.host}?${params.toString()}`;
}

export const RepoUrlPicker = ({
  uiSchema,
  onChange,
  rawErrors,
  formData,
}: CustomFieldExtension<string, RepoUrlPickerUiOptions>) => {
  const [state, setState] = useState<{
    host?: string;
    owner?: string;
    repo?: string;
    organization?: string;
    workspace?: string;
    project?: string;
  }>({});
  const integrationApi = useApi(scmIntegrationsApiRef);

  const allowedHosts = uiSchema?.['ui:options']?.allowedHosts ?? [];
  const allowedOwners = uiSchema?.['ui:options']?.allowedOwners ?? [];

  useEffect(() => {
    onChange(serializeFormData(state));
  }, [state, onChange]);

  return (
    <>
      <RepoUrlPickerHost
        host={state.host}
        hosts={allowedHosts}
        onChange={host => setState({ host })}
        rawErrors={rawErrors}
      />
      {state.host && integrationApi.byHost(state.host)?.type === 'github' && (
        <GithubRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          owner={state.owner}
          repoName={state.repo}
          onRepoNameChange={repo =>
            setState(prevState => ({ ...prevState, repo }))
          }
          onOwnerChange={owner =>
            setState(prevState => ({ ...prevState, owner }))
          }
        />
      )}
      {state.host && integrationApi.byHost(state.host)?.type === 'gitlab' && (
        <GitlabRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          owner={state.owner}
          repoName={state.repo}
          onRepoNameChange={repo =>
            setState(prevState => ({ ...prevState, repo }))
          }
          onOwnerChange={owner =>
            setState(prevState => ({ ...prevState, owner }))
          }
        />
      )}
      {state.host &&
        integrationApi.byHost(state.host)?.type === 'bitbucket' && (
          <BitbucketRepoPicker
            rawErrors={rawErrors}
            host={state.host}
            project={state.project}
            workspace={state.workspace}
            repoName={state.repo}
            onRepoNameChange={repo =>
              setState(prevState => ({ ...prevState, repo }))
            }
            onProjectChange={project =>
              setState(prevState => ({ ...prevState, project }))
            }
            onWorkspaceChange={workspace =>
              setState(prevState => ({ ...prevState, workspace }))
            }
          />
        )}
      {state.host && integrationApi.byHost(state.host)?.type === 'azure' && (
        <AzureRepoPicker
          rawErrors={rawErrors}
          org={state.organization}
          repoName={state.repo}
          owner={state.owner}
          onOwnerChange={owner =>
            setState(prevState => ({ ...prevState, owner }))
          }
          onRepoNameChange={repo =>
            setState(prevState => ({ ...prevState, repo }))
          }
          onOrgChange={org =>
            setState(prevState => ({ ...prevState, organization: org }))
          }
        />
      )}
    </>
  );
};
