/*
 * Copyright 2025 The Backstage Authors
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
import { useEffect, useState, useCallback, useMemo } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';

import { RepoOwnerPickerProps } from './schema';
import { RepoOwnerPickerState } from './types';
import { DefaultRepoOwnerPicker } from './DefaultRepoOwnerPicker';
import { GitHubRepoOwnerPicker } from './GitHubRepoOwnerPicker';

/**
 * The underlying component that is rendered in the form for the `RepoOwnerPicker`
 * field extension.
 *
 * @public
 */
export const RepoOwnerPicker = (props: RepoOwnerPickerProps) => {
  const { uiSchema, onChange, rawErrors, formData, schema, required } = props;
  const [state, setState] = useState<RepoOwnerPickerState>({
    owner: formData || '',
  });
  const excludedOwners = useMemo(
    () => uiSchema?.['ui:options']?.excludedOwners ?? [],
    [uiSchema],
  );
  const { host, owner } = state;

  const integrationApi = useApi(scmIntegrationsApiRef);
  const scmAuthApi = useApi(scmAuthApiRef);

  const { secrets, setSecrets } = useTemplateSecrets();

  useDebounce(
    async () => {
      const { requestUserCredentials } = uiSchema?.['ui:options'] ?? {};

      if (!requestUserCredentials || !host) {
        return;
      }

      // don't show login prompt if secret value is already in state
      if (secrets[requestUserCredentials.secretsKey]) {
        return;
      }

      // user has requested that we use the users credentials
      // so lets grab them using the scmAuthApi and pass through
      // any additional scopes from the ui:options
      const { token } = await scmAuthApi.getCredentials({
        url: `https://${host}`,
        additionalScope: {
          repoWrite: true,
          customScopes: requestUserCredentials.additionalScopes,
        },
      });

      // set the secret using the key provided in the ui:options for use
      // in the templating the manifest with ${{ secrets[secretsKey] }}
      setSecrets({ [requestUserCredentials.secretsKey]: token });
    },
    500,
    [host, uiSchema],
  );

  useEffect(() => {
    if (uiSchema?.['ui:options']?.host) {
      const hostUiOption = uiSchema['ui:options'].host;
      setState(prevState => ({ ...prevState, host: hostUiOption }));
    }
  }, [uiSchema]);

  useEffect(() => {
    onChange(owner);
  }, [owner, onChange]);

  const updateLocalState = useCallback(
    (newState: RepoOwnerPickerState) => {
      setState(prevState => ({ ...prevState, ...newState }));
    },
    [setState],
  );

  const hostType = (host && integrationApi.byHost(host)?.type) ?? null;

  const renderRepoOwnerPicker = () => {
    switch (hostType) {
      case 'github':
        return (
          <GitHubRepoOwnerPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            accessToken={
              uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
              secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey]
            }
            isDisabled={uiSchema?.['ui:disabled'] ?? false}
            required={required}
            schema={schema}
            excludedOwners={excludedOwners}
          />
        );
      default:
        return (
          <DefaultRepoOwnerPicker
            onChange={updateLocalState}
            state={state}
            rawErrors={rawErrors}
            isDisabled={uiSchema?.['ui:disabled'] ?? false}
            required={required}
            schema={schema}
          />
        );
    }
  };

  return renderRepoOwnerPicker();
};
