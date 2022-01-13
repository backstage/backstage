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
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { GitlabRepoPicker } from './GitlabRepoPicker';
import { AzureRepoPicker } from './AzureRepoPicker';
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { FieldExtensionComponentProps } from '../../../extensions';
import { RepoUrlPickerHost } from './RepoUrlPickerHost';
import { parseRepoPickerUrl, serializeRepoPickerUrl } from './utils';
import { RepoUrlPickerState } from './types';

export interface RepoUrlPickerUiOptions {
  allowedHosts?: string[];
  allowedOwners?: string[];
}

export const RepoUrlPicker = ({
  uiSchema,
  onChange,
  rawErrors,
  formData,
}: FieldExtensionComponentProps<string, RepoUrlPickerUiOptions>) => {
  const [state, setState] = useState<RepoUrlPickerState>(
    parseRepoPickerUrl(formData),
  );
  const integrationApi = useApi(scmIntegrationsApiRef);

  const allowedHosts = uiSchema?.['ui:options']?.allowedHosts ?? [];
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

  return (
    <>
      <RepoUrlPickerHost
        host={state.host}
        hosts={allowedHosts}
        onChange={host => setState(prevState => ({ ...prevState, host }))}
        rawErrors={rawErrors}
      />
      {state.host && integrationApi.byHost(state.host)?.type === 'github' && (
        <GithubRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
      {state.host && integrationApi.byHost(state.host)?.type === 'gitlab' && (
        <GitlabRepoPicker
          allowedOwners={allowedOwners}
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
      {state.host &&
        integrationApi.byHost(state.host)?.type === 'bitbucket' && (
          <BitbucketRepoPicker
            rawErrors={rawErrors}
            state={state}
            onChange={updateLocalState}
          />
        )}
      {state.host && integrationApi.byHost(state.host)?.type === 'azure' && (
        <AzureRepoPicker
          rawErrors={rawErrors}
          state={state}
          onChange={updateLocalState}
        />
      )}
    </>
  );
};
