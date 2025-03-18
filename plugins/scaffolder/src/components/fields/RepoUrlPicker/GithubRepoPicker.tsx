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
import React, { useCallback, useMemo, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import { Select, SelectItem } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import useDebounce from 'react-use/esm/useDebounce';
import Autocomplete from '@material-ui/lab/Autocomplete';
import uniq from 'lodash/uniq';
import map from 'lodash/map';

export const GithubRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    accessToken?: string;
  }>,
) => {
  const {
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
    accessToken,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { host, owner } = state;

  const scaffolderApi = useApi(scaffolderApiRef);

  const [availableRepositoriesWithOwner, setAvailableRepositoriesWithOwner] =
    useState<{ owner: string; name: string }[]>([]);

  // Update available repositories with owner when client is available
  const updateAvailableRepositoriesWithOwner = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host) {
      setAvailableRepositoriesWithOwner([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'repositoriesWithOwner',
        provider: 'github',
        context: { host },
      })
      .then(({ results }) => {
        setAvailableRepositoriesWithOwner(
          results.map(r => {
            const [rOwner, rName] = r.id.split('/');
            return { owner: rOwner, name: rName };
          }),
        );
      })
      .catch(() => {
        setAvailableRepositoriesWithOwner([]);
      });
  }, [scaffolderApi, accessToken, host]);

  useDebounce(updateAvailableRepositoriesWithOwner, 500, [
    updateAvailableRepositoriesWithOwner,
  ]);

  // Update available owners when available repositories with owner change
  const availableOwners = useMemo<string[]>(
    () => uniq(map(availableRepositoriesWithOwner, 'owner')),
    [availableRepositoriesWithOwner],
  );

  // Update available repositories when available repositories with owner change or when owner changes
  const updateAvailableRepositories = useCallback(() => {
    const availableRepos = availableRepositoriesWithOwner.flatMap(r =>
      r.owner === owner ? [{ name: r.name }] : [],
    );

    onChange({ availableRepos });
  }, [availableRepositoriesWithOwner, owner, onChange]);

  useDebounce(updateAvailableRepositories, 500, [updateAvailableRepositories]);

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <>
            <Select
              native
              label={t('fields.githubRepoPicker.owner.title')}
              onChange={s =>
                onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
              }
              disabled={isDisabled || allowedOwners.length === 1}
              selected={owner}
              items={ownerItems}
            />
          </>
        ) : (
          <Autocomplete
            value={owner}
            onChange={(_, newValue) => {
              onChange({ owner: newValue || '' });
            }}
            options={availableOwners}
            renderInput={params => (
              <TextField
                {...params}
                label={t('fields.githubRepoPicker.owner.inputTitle')}
                disabled={isDisabled}
                required
              />
            )}
            freeSolo
            disabled={isDisabled}
            autoSelect
          />
        )}
        <FormHelperText>
          {t('fields.githubRepoPicker.owner.description')}
        </FormHelperText>
      </FormControl>
    </>
  );
};
