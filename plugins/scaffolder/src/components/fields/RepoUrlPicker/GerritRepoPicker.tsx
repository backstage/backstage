/*
 * Copyright 2022 The Backstage Authors
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
import MuiTextField from '@material-ui/core/TextField';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField } from '@backstage/ui';

export const GerritRepoPicker = (props: BaseRepoUrlPickerProps) => {
  const theme = useScaffolderTheme();
  const { onChange, rawErrors, state, isDisabled } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const { workspace, owner } = state;

  if (theme === 'bui') {
    return (
      <>
        <BuiTextField
          label={t('fields.gerritRepoPicker.owner.title')}
          description={t('fields.gerritRepoPicker.owner.description')}
          onChange={value => onChange({ owner: value })}
          isDisabled={isDisabled}
          value={owner ?? ''}
          isInvalid={rawErrors?.length > 0 && !owner}
        />
        <BuiTextField
          label={t('fields.gerritRepoPicker.parent.title')}
          description={t('fields.gerritRepoPicker.parent.description')}
          onChange={value => onChange({ workspace: value })}
          isDisabled={isDisabled}
          value={workspace ?? ''}
          isInvalid={rawErrors?.length > 0 && !workspace}
          isRequired
        />
      </>
    );
  }

  return (
    <>
      <FormControl margin="normal" error={rawErrors?.length > 0 && !workspace}>
        <MuiTextField
          id="ownerInput"
          label={t('fields.gerritRepoPicker.owner.title')}
          onChange={e => onChange({ owner: e.target.value })}
          helperText={t('fields.gerritRepoPicker.owner.description')}
          disabled={isDisabled}
          value={owner}
        />
      </FormControl>
      <FormControl
        margin="normal"
        required
        error={rawErrors?.length > 0 && !workspace}
      >
        <MuiTextField
          id="parentInput"
          label={t('fields.gerritRepoPicker.parent.title')}
          onChange={e => onChange({ workspace: e.target.value })}
          disabled={isDisabled}
          value={workspace}
          helperText={t('fields.gerritRepoPicker.parent.description')}
        />
      </FormControl>
    </>
  );
};
