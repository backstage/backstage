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
  scmIntegrationsApiRef,
  scmAuthApiRef,
} from '@backstage/integration-react';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { GitlabRepoPicker } from './GitlabRepoPicker';
import { AzureRepoPicker } from './AzureRepoPicker';
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { FieldExtensionComponentProps } from '../../../extensions';
import { RepoUrlPickerHost } from './RepoUrlPickerHost';
import { parseRepoPickerUrl, serializeRepoPickerUrl } from './utils';
import { RepoUrlPickerState } from './types';
import useDebounce from 'react-use/lib/useDebounce';
import { useTemplateSecrets } from '../../secrets';

/**
 * The input props that can be specified under `ui:options` for the
 * `RepoUrlPicker` field extension.
 *
 * @public
 */
export interface RepoUrlPickerUiOptions {
  allowedHosts?: string[];
  allowedOwners?: string[];
  requestUserCredentials?: {
    secretsKey: string;
    additionalScopes?: {
      github?: string[];
      gitlab?: string[];
      bitbucket?: string[];
      azure?: string[];
    };
  };
}

/**
 * The underlying component that is rendered in the form for the `RepoUrlPicker`
 * field extension.
 *
 * @public
 */
export const RepoUrlPicker = (
  props: FieldExtensionComponentProps<string, RepoUrlPickerUiOptions>,
) => {
  const { uiSchema, onChange, rawErrors, formData } = props;
  const [state, setState] = useState<RepoUrlPickerState>(
    parseRepoPickerUrl(formData),
  );
  const integrationApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);
  const { setSecrets } = useTemplateSecrets();
  const allowedHosts = useMemo(
    () => uiSchema?.['ui:options']?.allowedHosts ?? [],
    [uiSchema],
  );
  const allowedOwners = useMemo(
    () => uiSchema?.['ui:options']?.allowedOwners ?? [],
    [uiSchema],
  );

  useEffect(() => {
    onChange(serializeRepoPickerUrl(state));
  }, [state, onChange]);

  /* we deal with calling the repo setting here instead of in each components for ease */
  useEffect(() => {
    if (allowedOwners.length === 1) {
      setState(prevState => ({ ...prevState, owner: allowedOwners[0] }));
    }
  }, [setState, allowedOwners]);

  const updateLocalState = useCallback(
    (newState: RepoUrlPickerState) => {
      setState(prevState => ({ ...prevState, ...newState }));
    },
    [setState],
  );

  useDebounce(
    async () => {
      const { requestUserCredentials } = uiSchema?.['ui:options'] ?? {};

      if (
        !requestUserCredentials ||
        !(state.host && state.owner && state.repoName)
      ) {
        return;
      }

      const [host, owner, repoName] = [
        state.host,
        state.owner,
        state.repoName,
      ].map(encodeURIComponent);

      // user has requested that we use the users credentials
      // so lets grab them using the scmAuthApi and pass through
      // any additional scopes from the ui:options
      const { token } = await scmAuthApi.getCredentials({
        url: `https://${host}/${owner}/${repoName}`,
        additionalScope: {
          repoWrite: true,
          customScopes: requestUserCredentials.additionalScopes,
        },
      });

      // set the secret using the key provided in the the ui:options for use
      // in the templating the manifest with ${{ secrets[secretsKey] }}
      setSecrets({ [requestUserCredentials.secretsKey]: token });
    },
    500,
    [state, uiSchema],
  );

  const hostType =
    (state.host && integrationApi.byHost(state.host)?.type) ?? null;

  return (
    <>
      <RepoUrlPickerHost
        host={state.host}
        hosts={allowedHosts}
        onChange={host => setState(prevState => ({ ...prevState, host }))}
        rawErrors={rawErrors}
      />
      {hostType === 'github' && (
        <GithubRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
      {hostType === 'gitlab' && (
        <GitlabRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
      {hostType === 'bitbucket' && (
        <BitbucketRepoPicker
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
      {hostType === 'azure' && (
        <AzureRepoPicker
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
    </>
  );
};
