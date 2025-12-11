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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useCallback, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { BaseRepoOwnerPickerProps } from './types';
import { scaffolderTranslationRef } from '../../../translation';

/**
 * The underlying component that is rendered in the form for the `GitHubRepoOwnerPicker`
 * field extension.
 *
 * @public
 *
 */
export const GitHubRepoOwnerPicker = ({
  onChange,
  state,
  rawErrors,
  accessToken,
  isDisabled,
  required,
  schema,
  excludedOwners = [],
}: BaseRepoOwnerPickerProps<{
  accessToken?: string;
  excludedOwners?: string[];
}>) => {
  const { host, owner } = state;

  const [availableOwners, setAvailableOwners] = useState<string[]>([]);

  const scaffolderApi = useApi(scaffolderApiRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const updateAvailableOwners = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host) {
      setAvailableOwners([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'owners',
        context: { host },
        provider: 'github',
      })
      .then(({ results }) => {
        const owners = results
          .map(r => r.id)
          .filter(id => !excludedOwners.includes(id));

        setAvailableOwners(owners);
      })
      .catch(() => {
        setAvailableOwners([]);
      });
  }, [host, accessToken, scaffolderApi, excludedOwners]);

  useDebounce(updateAvailableOwners, 500, [updateAvailableOwners]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !owner}
    >
      <Autocomplete
        value={owner}
        onChange={(_, newValue) => {
          onChange({ owner: newValue || '' });
        }}
        disabled={isDisabled}
        options={availableOwners}
        renderInput={params => (
          <TextField
            {...params}
            label={schema?.title ?? t('fields.repoOwnerPicker.title')}
            disabled={isDisabled}
            required={required}
          />
        )}
        freeSolo
        autoSelect
      />
      <FormHelperText>
        {schema?.description ?? t('fields.repoOwnerPicker.description')}
      </FormHelperText>
    </FormControl>
  );
};
