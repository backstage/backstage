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
import {
  scmAuthApiRef,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { AzureRepoPicker } from './AzureRepoPicker';
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { GerritRepoPicker } from './GerritRepoPicker';
import { GiteaRepoPicker } from './GiteaRepoPicker';
import { GithubRepoPicker } from './GithubRepoPicker';
import { GitlabRepoPicker } from './GitlabRepoPicker';
import { RepoUrlPickerHost } from './RepoUrlPickerHost';
import { RepoUrlPickerRepoName } from './RepoUrlPickerRepoName';
import { RepoUrlPickerFieldSchema } from './schema';
import { RepoUrlPickerState } from './types';
import { parseRepoPickerUrl, serializeRepoPickerUrl } from './utils';

export { RepoUrlPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `RepoUrlPicker`
 * field extension.
 *
 * @public
 */
export const RepoUrlPicker = (
  props: typeof RepoUrlPickerFieldSchema.TProps,
) => {
  const { uiSchema, onChange, rawErrors, formData, schema } = props;
  const [state, setState] = useState<RepoUrlPickerState>(
    parseRepoPickerUrl(formData),
  );
  const [credentialsHost, setCredentialsHost] = useState<string | undefined>(
    undefined,
  );
  const integrationApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);
  const { secrets, setSecrets } = useTemplateSecrets();
  const allowedHosts = useMemo(
    () => uiSchema?.['ui:options']?.allowedHosts ?? [],
    [uiSchema],
  );
  const allowedOrganizations = useMemo(
    () => uiSchema?.['ui:options']?.allowedOrganizations ?? [],
    [uiSchema],
  );
  const allowedOwners = useMemo(
    () => uiSchema?.['ui:options']?.allowedOwners ?? [],
    [uiSchema],
  );
  const allowedProjects = useMemo(
    () => uiSchema?.['ui:options']?.allowedProjects ?? [],
    [uiSchema],
  );
  const allowedRepos = useMemo(
    () => uiSchema?.['ui:options']?.allowedRepos ?? [],
    [uiSchema],
  );
  const isDisabled = useMemo(
    () => uiSchema?.['ui:disabled'] ?? false,
    [uiSchema],
  );
  const { owner, organization, project, repoName } = state;

  useEffect(() => {
    onChange(serializeRepoPickerUrl(state));
  }, [state, onChange]);

  /* we deal with calling the repo setting here instead of in each components for ease */
  useEffect(() => {
    if (allowedOrganizations.length > 0 && !organization) {
      setState(prevState => ({
        ...prevState,
        organization: allowedOrganizations[0],
      }));
    }
  }, [setState, allowedOrganizations, organization]);

  useEffect(() => {
    if (allowedOwners.length > 0 && !owner) {
      setState(prevState => ({
        ...prevState,
        owner: allowedOwners[0],
      }));
    }
  }, [setState, allowedOwners, owner]);

  useEffect(() => {
    if (allowedProjects.length > 0 && !project) {
      setState(prevState => ({
        ...prevState,
        project: allowedProjects[0],
      }));
    }
  }, [setState, allowedProjects, project]);

  useEffect(() => {
    if (allowedRepos.length > 0 && !repoName) {
      setState(prevState => ({ ...prevState, repoName: allowedRepos[0] }));
    }
  }, [setState, allowedRepos, repoName]);

  const updateLocalState = useCallback(
    (newState: RepoUrlPickerState) => {
      setState(prevState => ({ ...prevState, ...newState }));
    },
    [setState],
  );

  useDebounce(
    async () => {
      const { requestUserCredentials } = uiSchema?.['ui:options'] ?? {};

      if (!requestUserCredentials || !state.host) {
        return;
      }

      // don't show login prompt if secret value is already in state for selected host
      if (
        secrets[requestUserCredentials.secretsKey] &&
        credentialsHost === state.host
      ) {
        return;
      }

      // user has requested that we use the users credentials
      // so lets grab them using the scmAuthApi and pass through
      // any additional scopes from the ui:options
      const { token } = await scmAuthApi.getCredentials({
        url: `https://${state.host}`,
        additionalScope: {
          repoWrite: true,
          customScopes: requestUserCredentials.additionalScopes,
        },
      });

      // set the secret using the key provided in the ui:options for use
      // in the templating the manifest with ${{ secrets[secretsKey] }}
      setSecrets({ [requestUserCredentials.secretsKey]: token });
      setCredentialsHost(state.host);
    },
    500,
    [state, uiSchema],
  );

  const hostType =
    (state.host && integrationApi.byHost(state.host)?.type) ?? null;
  return (
    <>
      {schema.title && (
        <Box my={1}>
          <Typography variant="h5">{schema.title}</Typography>
          <Divider />
        </Box>
      )}
      {schema.description && (
        <Typography variant="body1">{schema.description}</Typography>
      )}
      <RepoUrlPickerHost
        host={state.host}
        hosts={allowedHosts}
        onChange={host => setState(prevState => ({ ...prevState, host }))}
        rawErrors={rawErrors}
        isDisabled={isDisabled}
      />
      {hostType === 'github' && (
        <GithubRepoPicker
          allowedOwners={allowedOwners}
          onChange={updateLocalState}
          rawErrors={rawErrors}
          state={state}
          isDisabled={isDisabled}
          accessToken={
            uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
            secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey]
          }
        />
      )}
      {hostType === 'gitea' && (
        <GiteaRepoPicker
          allowedOwners={allowedOwners}
          allowedRepos={allowedRepos}
          rawErrors={rawErrors}
          state={state}
          isDisabled={isDisabled}
          onChange={updateLocalState}
        />
      )}
      {hostType === 'gitlab' && (
        <GitlabRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
          isDisabled={isDisabled}
          accessToken={
            uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
            secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey]
          }
        />
      )}
      {hostType === 'bitbucket' && (
        <BitbucketRepoPicker
          allowedOwners={allowedOwners}
          allowedProjects={allowedProjects}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
          isDisabled={isDisabled}
          accessToken={
            uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
            secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey]
          }
        />
      )}
      {hostType === 'azure' && (
        <AzureRepoPicker
          allowedOrganizations={allowedOrganizations}
          allowedProject={allowedProjects}
          rawErrors={rawErrors}
          state={state}
          isDisabled={isDisabled}
          onChange={updateLocalState}
        />
      )}
      {hostType === 'gerrit' && (
        <GerritRepoPicker
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
          isDisabled={isDisabled}
        />
      )}
      <RepoUrlPickerRepoName
        repoName={state.repoName}
        allowedRepos={allowedRepos}
        onChange={repo =>
          setState(prevState => ({
            ...prevState,
            repoName: repo.id || repo.name,
          }))
        }
        isDisabled={isDisabled}
        rawErrors={rawErrors}
        availableRepos={state.availableRepos}
      />
    </>
  );
};
