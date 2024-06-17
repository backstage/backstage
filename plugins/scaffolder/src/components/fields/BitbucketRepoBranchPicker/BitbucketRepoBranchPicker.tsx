/*
 * Copyright 2024 The Backstage Authors
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

import {
  scaffolderApiRef,
  useTemplateSecrets,
} from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import React, { useEffect, useMemo, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from 'react-use/esm/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { scmAuthApiRef } from '@backstage/integration-react';
import { BitbucketRepoBranchPickerProps } from './schema';

export const BitbucketRepoBranchPicker = ({
  onChange,
  rawErrors,
  required,
  formData,
  formContext: {
    formData: { repoUrl },
  },
  uiSchema,
}: BitbucketRepoBranchPickerProps) => {
  const { secrets, setSecrets } = useTemplateSecrets();

  const accessToken = useMemo(
    () =>
      uiSchema?.['ui:options']?.requestUserCredentials?.secretsKey &&
      secrets[uiSchema['ui:options'].requestUserCredentials.secretsKey],
    [secrets, uiSchema],
  );

  const [host, setHost] = useState<string>();
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [repository, setRepository] = useState<string | null>(null);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  const scmAuthApi = useApi(scmAuthApiRef);
  const scaffolderApi = useApi(scaffolderApiRef);

  useEffect(() => {
    if (repoUrl) {
      const url = new URL(`https://${repoUrl}`);
      setHost(url.host);
      setWorkspace(url.searchParams.get('workspace'));
      setRepository(url.searchParams.get('repo'));
    }
  }, [repoUrl]);

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

  useDebounce(
    () => {
      const updateAvailableBranches = async () => {
        if (
          host === 'bitbucket.org' &&
          accessToken &&
          workspace &&
          repository
        ) {
          const result = await scaffolderApi.autocomplete(
            accessToken,
            'bitbucketCloud',
            'branches',
            { workspace, repository },
          );

          setAvailableBranches(result);
        } else {
          setAvailableBranches([]);
        }
      };

      updateAvailableBranches().catch(() => setAvailableBranches([]));
    },
    500,
    [host, accessToken, workspace, repository],
  );

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        onChange={(_, newValue) => {
          onChange(newValue || '');
        }}
        options={availableBranches}
        renderInput={params => (
          <TextField {...params} label="Branch" required={required} />
        )}
        freeSolo
        autoSelect
      />
    </FormControl>
  );
};
