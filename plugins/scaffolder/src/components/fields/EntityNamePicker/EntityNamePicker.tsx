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
import { EntityNamePickerProps } from './schema';
import MuiTextField from '@material-ui/core/TextField';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useScaffolderTheme } from '@backstage/plugin-scaffolder-react/alpha';
import { TextField as BuiTextField } from '@backstage/ui';

export { EntityNamePickerSchema } from './schema';

/**
 * EntityName Picker
 */
export const EntityNamePicker = (props: EntityNamePickerProps) => {
  const theme = useScaffolderTheme();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    onChange,
    required,
    schema: {
      title = t('fields.entityNamePicker.title'),
      description = t('fields.entityNamePicker.description'),
    },
    rawErrors,
    formData,
    uiSchema,
    uiSchema: { 'ui:autofocus': autoFocus },
    idSchema,
    placeholder,
  } = props;

  if (theme === 'bui') {
    return (
      <BuiTextField
        id={idSchema?.$id}
        label={title}
        description={uiSchema['ui:description'] ?? description}
        secondaryLabel={required ? 'Required' : undefined}
        placeholder={placeholder}
        isRequired={required}
        value={formData ?? ''}
        onChange={onChange}
        isInvalid={rawErrors?.length > 0 && !formData}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
      />
    );
  }

  return (
    <MuiTextField
      id={idSchema?.$id}
      label={title}
      placeholder={placeholder}
      helperText={description}
      required={required}
      value={formData ?? ''}
      onChange={({ target: { value } }) => onChange(value)}
      margin="normal"
      error={rawErrors?.length > 0 && !formData}
      inputProps={{ autoFocus }}
      FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
    />
  );
};
