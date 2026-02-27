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
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { useCallback, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { BaseRepoBranchPickerProps } from './types';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';
import type { Key } from 'react-aria-components';

/**
 * The underlying component that is rendered in the form for the `GitHubRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const GitHubRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  accessToken,
  isDisabled,
  required,
}: BaseRepoBranchPickerProps<{
  accessToken?: string;
}>) => {
  const theme = useScaffolderTheme();
  const { host, owner, repository, branch } = state;

  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  const scaffolderApi = useApi(scaffolderApiRef);

  const updateAvailableBranches = useCallback(() => {
    if (
      !scaffolderApi.autocomplete ||
      !owner ||
      !repository ||
      !accessToken ||
      !host
    ) {
      setAvailableBranches([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'branches',
        context: { host, owner, repository },
        provider: 'github',
      })
      .then(({ results }) => {
        setAvailableBranches(results.map(r => r.id));
      })
      .catch(() => {
        setAvailableBranches([]);
      });
  }, [host, owner, repository, accessToken, scaffolderApi]);

  useDebounce(updateAvailableBranches, 500, [updateAvailableBranches]);

  if (theme === 'bui') {
    const options = availableBranches.map(b => ({ label: b, value: b }));

    return (
      <BuiAutocomplete
        label="Branch"
        description="The branch of the repository"
        inputValue={branch ?? ''}
        onInputChange={value => onChange({ branch: value })}
        onSelectionChange={(key: Key | null) => {
          if (key !== null) {
            onChange({ branch: String(key) });
          }
        }}
        options={options}
        isDisabled={isDisabled}
        isRequired={required}
        isInvalid={rawErrors?.length > 0 && !branch}
      />
    );
  }

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !branch}
    >
      <MuiAutocomplete
        value={branch}
        onChange={(_, newValue) => {
          onChange({ branch: newValue || '' });
        }}
        disabled={isDisabled}
        options={availableBranches}
        renderInput={params => (
          <MuiTextField
            {...params}
            label="Branch"
            disabled={isDisabled}
            required={required}
          />
        )}
        freeSolo
        autoSelect
      />
      <FormHelperText>The branch of the repository</FormHelperText>
    </FormControl>
  );
};
