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
import React, { useCallback, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { Select, SelectItem } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import useDebounce from 'react-use/esm/useDebounce';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { useApi } from '@backstage/core-plugin-api';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export const GitlabRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    allowedRepos?: string[];
    accessToken?: string;
  }>,
) => {
  const { allowedOwners = [], state, onChange, rawErrors, accessToken } = props;
  const [availableGroups, setAvailableGroups] = useState<
    { title: string; context: { groupId?: string; userId?: string } }[]
  >([]);
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { owner, host } = state;

  const scaffolderApi = useApi(scaffolderApiRef);

  const updateAvailableGroups = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || host !== 'gitlab.com') {
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
              title: r.title,
              context: {
                userId: r.context?.userId as string | undefined,
                groupId: r.context?.groupId as string | undefined,
              },
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
    if (
      !scaffolderApi.autocomplete ||
      !accessToken ||
      host !== 'gitlab.com' ||
      !owner
    ) {
      onChange({ availableRepos: [] });
      return;
    }

    const selectedGroup = availableGroups.find(group => group.title === owner);

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'repositories',
        context: {
          groupId: selectedGroup?.context.groupId,
          userId: selectedGroup?.context.userId,
          host,
        },
        provider: 'gitlab',
      })
      .then(({ results }) => {
        onChange({ availableRepos: results.map(r => r.title) });
      })
      .catch(() => {
        onChange({ availableRepos: [] });
      });
  }, [scaffolderApi, accessToken, host, owner, onChange, availableGroups]);

  useDebounce(updateAvailableRepositories, 500, [updateAvailableRepositories]);

  return (
    <FormControl
      margin="normal"
      required
      error={rawErrors?.length > 0 && !owner}
    >
      {allowedOwners?.length ? (
        <Select
          native
          label="Owner Available"
          onChange={selected =>
            onChange({
              owner: String(Array.isArray(selected) ? selected[0] : selected),
            })
          }
          disabled={allowedOwners.length === 1}
          selected={owner}
          items={ownerItems}
        />
      ) : (
        <Autocomplete
          value={owner}
          onChange={(_, newValue) => {
            onChange({ owner: newValue || '' });
          }}
          options={availableGroups.map(group => group.title)}
          renderInput={params => (
            <TextField {...params} label="Owner" required />
          )}
          freeSolo
          autoSelect
        />
      )}
      <FormHelperText>
        GitLab namespace where this repository will belong to. It can be the
        name of organization, group, subgroup, user, or the project.
      </FormHelperText>
    </FormControl>
  );
};
