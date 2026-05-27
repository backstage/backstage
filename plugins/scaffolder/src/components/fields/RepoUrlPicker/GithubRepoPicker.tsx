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
import { useCallback, useMemo, useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import { Select as MuiSelect, SelectItem } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import useDebounce from 'react-use/esm/useDebounce';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import uniq from 'lodash/uniq';
import map from 'lodash/map';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { Select as BuiSelect } from '@backstage/ui';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';
import overrides from '../scaffolderFieldOverrides.module.css';
import type { Key } from 'react-aria-components';

export const GithubRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    accessToken?: string;
  }>,
) => {
  const theme = useScaffolderTheme();
  const {
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
    accessToken,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

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

  if (theme === 'bui') {
    if (allowedOwners?.length) {
      const ownerItems = allowedOwners.map(i => ({ label: i, value: i }));

      return (
        <BuiSelect
          className={overrides.select}
          label={t('fields.githubRepoPicker.owner.title')}
          description={t('fields.githubRepoPicker.owner.description')}
          isDisabled={isDisabled || allowedOwners.length === 1}
          isInvalid={rawErrors?.length > 0 && !owner}
          selectedKey={owner ?? null}
          onSelectionChange={(key: Key | null) => {
            if (key !== null) onChange({ owner: String(key) });
          }}
          options={ownerItems}
          isRequired
        />
      );
    }

    const options = availableOwners.map(o => ({ label: o, value: o }));

    return (
      <BuiAutocomplete
        label={t('fields.githubRepoPicker.owner.inputTitle')}
        description={t('fields.githubRepoPicker.owner.description')}
        inputValue={owner ?? ''}
        onInputChange={value => onChange({ owner: value })}
        onSelectionChange={(key: Key | null) => {
          if (key !== null) {
            onChange({ owner: String(key) });
          }
        }}
        options={options}
        isDisabled={isDisabled}
        isRequired
        isInvalid={rawErrors?.length > 0 && !owner}
      />
    );
  }

  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !owner}
      >
        {allowedOwners?.length ? (
          <>
            <MuiSelect
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
          <MuiAutocomplete
            value={owner}
            onChange={(_, newValue) => {
              onChange({ owner: newValue || '' });
            }}
            options={availableOwners}
            renderInput={params => (
              <MuiTextField
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
