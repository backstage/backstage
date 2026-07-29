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
import { Select as MuiSelect, SelectItem } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';
import { useEffect } from 'react';
import { scaffolderTranslationRef } from '../../../translation';
import { AvailableRepositories } from './types';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { Select as BuiSelect } from '@backstage/ui';
import { Autocomplete as BuiAutocomplete } from '../Autocomplete';
import overrides from '../scaffolderFieldOverrides.module.css';
import type { Key } from 'react-aria-components';

export const RepoUrlPickerRepoName = (props: {
  repoName?: string;
  allowedRepos?: string[];
  onChange: (chosenRepo: AvailableRepositories) => void;
  rawErrors: string[];
  availableRepos?: AvailableRepositories[];
  isDisabled?: boolean;
}) => {
  const theme = useScaffolderTheme();
  const {
    repoName,
    allowedRepos,
    onChange,
    rawErrors,
    availableRepos,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  useEffect(() => {
    // If there is no repoName chosen currently
    if (!repoName) {
      // Set the first of the allowedRepos option if that available
      if (allowedRepos?.length) {
        onChange({ name: allowedRepos[0] });
      }
    }
  }, [allowedRepos, repoName, onChange]);

  if (theme === 'bui') {
    if (allowedRepos?.length) {
      const repoItems = allowedRepos.map(i => ({ label: i, value: i }));

      return (
        <BuiSelect
          className={overrides.select}
          label={t('fields.repoUrlPicker.repository.title')}
          description={t('fields.repoUrlPicker.repository.description')}
          isDisabled={isDisabled || allowedRepos.length === 1}
          isInvalid={rawErrors?.length > 0 && !repoName}
          selectedKey={repoName ?? null}
          onSelectionChange={(key: Key | null) => {
            if (key !== null) onChange({ name: String(key) });
          }}
          options={repoItems}
          isRequired
        />
      );
    }

    const options = (availableRepos || []).map(r => ({
      label: r.name,
      value: r.name,
    }));

    return (
      <BuiAutocomplete
        label={t('fields.repoUrlPicker.repository.inputTitle')}
        description={t('fields.repoUrlPicker.repository.description')}
        inputValue={repoName ?? ''}
        onInputChange={value => {
          const selectedRepo = availableRepos?.find(r => r.name === value);
          onChange(selectedRepo || { name: value });
        }}
        onSelectionChange={(key: Key | null) => {
          if (key !== null) {
            const selectedRepo = availableRepos?.find(
              r => r.name === String(key),
            );
            onChange(selectedRepo || { name: String(key) });
          }
        }}
        options={options}
        isDisabled={isDisabled}
        isRequired
        isInvalid={rawErrors?.length > 0 && !repoName}
      />
    );
  }

  const repoItems: SelectItem[] = allowedRepos
    ? allowedRepos.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !repoName}
      >
        {allowedRepos?.length ? (
          <MuiSelect
            native
            label={t('fields.repoUrlPicker.repository.title')}
            onChange={selected =>
              onChange({
                name: String(Array.isArray(selected) ? selected[0] : selected),
              })
            }
            disabled={isDisabled || allowedRepos.length === 1}
            selected={repoName}
            items={repoItems}
          />
        ) : (
          <MuiAutocomplete
            value={repoName}
            onChange={(_, newValue) => {
              const selectedRepo = availableRepos?.find(
                r => r.name === newValue,
              );
              onChange(selectedRepo || { name: newValue || '' });
            }}
            options={(availableRepos || []).map(r => r.name)}
            renderInput={params => (
              <MuiTextField
                {...params}
                label={t('fields.repoUrlPicker.repository.inputTitle')}
                required
              />
            )}
            freeSolo
            autoSelect
            disabled={isDisabled}
          />
        )}
        <FormHelperText>
          {t('fields.repoUrlPicker.repository.description')}
        </FormHelperText>
      </FormControl>
    </>
  );
};
