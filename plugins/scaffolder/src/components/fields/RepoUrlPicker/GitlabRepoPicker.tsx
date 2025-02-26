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
import { Select, SelectItem } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { scaffolderTranslationRef } from '../../../translation';
import { BaseRepoUrlPickerProps } from './types';

export const GitlabRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    allowedRepos?: string[];
    accessToken?: string;
  }>,
) => {
  const {
    allowedOwners = [],
    state,
    onChange,
    rawErrors,
    accessToken,
    isDisabled,
  } = props;
  const [availableGroups, setAvailableGroups] = useState<
    { title: string; id: string }[]
  >([]);
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner, host } = state;

  const scaffolderApi = useApi(scaffolderApiRef);

  const updateAvailableGroups = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host) {
      setAvailableGroups([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'groups',
        provider: 'gitlab',
        context: { host },
      })
      .then(({ results }) => {
        setAvailableGroups(
          results.map(r => {
            return {
              title: r.title!,
              id: r.id,
            };
          }),
        );
      })
      .catch(() => {
        setAvailableGroups([]);
      });
  }, [scaffolderApi, accessToken, host]);

  useDebounce(updateAvailableGroups, 500, [updateAvailableGroups]);

  // Update available repositories when client is available and group changes
  const updateAvailableRepositories = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host || !owner) {
      onChange({ availableRepos: [] });
      return;
    }

    const selectedGroup = availableGroups.find(group => group.title === owner);

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'repositories',
        context: {
          id: selectedGroup?.id ?? '',
          host,
        },
        provider: 'gitlab',
      })
      .then(({ results }) => {
        onChange({
          availableRepos: results.map(r => {
            return { name: r.title!, id: r.id };
          }),
        });
      })
      .catch(() => {
        onChange({ availableRepos: [] });
      });
  }, [scaffolderApi, accessToken, host, owner, onChange, availableGroups]);

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
              label={t('fields.gitlabRepoPicker.owner.title')}
              onChange={selected =>
                onChange({
                  owner: String(
                    Array.isArray(selected) ? selected[0] : selected,
                  ),
                })
              }
              disabled={isDisabled || allowedOwners.length === 1}
              selected={owner}
              items={ownerItems}
            />
            <FormHelperText>
              {t('fields.gitlabRepoPicker.owner.description')}
            </FormHelperText>
          </>
        ) : (
          <Autocomplete
            value={owner}
            onChange={(_, newValue) => {
              onChange({ owner: newValue || '' });
            }}
            options={availableGroups.map(group => group.title)}
            renderInput={params => (
              <TextField
                {...params}
                label={t('fields.gitlabRepoPicker.owner.title')}
                disabled={isDisabled}
                required
              />
            )}
            freeSolo
            disabled={isDisabled}
            autoSelect
          />
        )}
      </FormControl>
    </>
  );
};
