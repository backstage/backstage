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

import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useDebounce from 'react-use/esm/useDebounce';
import { useApi } from '@backstage/core-plugin-api';
import { RepoBranchPickerState } from './types';
import FormHelperText from '@material-ui/core/FormHelperText';

/**
 * The underlying component that is rendered in the form for the `BitbucketRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const BitbucketRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  accessToken,
}: {
  onChange: (state: RepoBranchPickerState) => void;
  state: RepoBranchPickerState;
  rawErrors: string[];
  accessToken?: string;
}) => {
  const { host, workspace, repository, branch } = state;

  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  const scaffolderApi = useApi(scaffolderApiRef);

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
    [host, workspace, repository, accessToken],
  );

  return (
    <FormControl
      margin="normal"
      required
      error={rawErrors?.length > 0 && !branch}
    >
      <Autocomplete
        value={branch}
        onChange={(_, newValue) => {
          onChange({ branch: newValue || '' });
        }}
        options={availableBranches}
        renderInput={params => (
          <TextField {...params} label="Branch" required />
        )}
        freeSolo
        autoSelect
      />
      <FormHelperText>The branch of the repository</FormHelperText>
    </FormControl>
  );
};
