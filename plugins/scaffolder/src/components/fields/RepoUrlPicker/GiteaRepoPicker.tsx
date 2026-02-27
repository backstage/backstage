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
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import { Select as MuiSelect, SelectItem } from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField, Select as BuiSelect } from '@backstage/ui';
import overrides from '../scaffolderFieldOverrides.module.css';
import type { Key } from 'react-aria-components';

export const GiteaRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    allowedRepos?: string[];
  }>,
) => {
  const theme = useScaffolderTheme();
  const { allowedOwners = [], state, onChange, rawErrors, isDisabled } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const { owner } = state;

  if (theme === 'bui') {
    if (allowedOwners?.length) {
      const ownerItems = allowedOwners.map(i => ({ label: i, value: i }));

      return (
        <BuiSelect
          className={overrides.select}
          label={t('fields.giteaRepoPicker.owner.title')}
          description={t('fields.giteaRepoPicker.owner.description')}
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

    return (
      <BuiTextField
        label={t('fields.giteaRepoPicker.owner.inputTitle')}
        description={t('fields.giteaRepoPicker.owner.description')}
        onChange={value => onChange({ owner: value })}
        isDisabled={isDisabled}
        value={owner ?? ''}
        isInvalid={rawErrors?.length > 0 && !owner}
        isRequired
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
              label={t('fields.giteaRepoPicker.owner.title')}
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
              {t('fields.giteaRepoPicker.owner.description')}
            </FormHelperText>
          </>
        ) : (
          <>
            <MuiTextField
              id="ownerInput"
              label={t('fields.giteaRepoPicker.owner.inputTitle')}
              onChange={e => onChange({ owner: e.target.value })}
              helperText={t('fields.giteaRepoPicker.owner.description')}
              disabled={isDisabled}
              value={owner}
            />
          </>
        )}
      </FormControl>
    </>
  );
};
