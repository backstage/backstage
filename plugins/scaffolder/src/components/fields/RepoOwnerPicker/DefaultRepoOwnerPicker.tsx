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

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MuiTextField from '@material-ui/core/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { BaseRepoOwnerPickerProps } from './types';
import { scaffolderTranslationRef } from '../../../translation';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField } from '@backstage/ui';

/**
 * The underlying component that is rendered in the form for the `DefaultRepoOwnerPicker`
 * field extension.
 *
 * @public
 *
 */
export const DefaultRepoOwnerPicker = ({
  onChange,
  state,
  rawErrors,
  isDisabled,
  required,
  schema,
}: BaseRepoOwnerPickerProps) => {
  const theme = useScaffolderTheme();
  const { owner } = state;

  const { t } = useTranslationRef(scaffolderTranslationRef);

  if (theme === 'bui') {
    return (
      <BuiTextField
        label={schema?.title ?? t('fields.repoOwnerPicker.title')}
        description={
          schema?.description ?? t('fields.repoOwnerPicker.description')
        }
        isDisabled={isDisabled}
        onChange={value => onChange({ owner: value })}
        value={owner ?? ''}
        isInvalid={rawErrors?.length > 0 && !owner}
        isRequired={required}
      />
    );
  }

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !owner}
    >
      <MuiTextField
        id="ownerInput"
        label={schema?.title ?? t('fields.repoOwnerPicker.title')}
        disabled={isDisabled}
        onChange={e => onChange({ owner: e.target.value })}
        value={owner}
      />
      <FormHelperText>
        {schema?.description ?? t('fields.repoOwnerPicker.description')}
      </FormHelperText>
    </FormControl>
  );
};
