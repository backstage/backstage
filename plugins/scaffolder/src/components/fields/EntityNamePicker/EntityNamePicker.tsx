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
import { Input, Label, cn } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

export { EntityNamePickerSchema } from './schema';

/**
 * EntityName Picker
 */
export const EntityNamePicker = (props: EntityNamePickerProps) => {
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
    uiSchema: { 'ui:autofocus': autoFocus },
    idSchema,
    placeholder,
  } = props;

  return (
    <div className="mt-4">
      <Label htmlFor={idSchema?.$id}>
        {title}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={idSchema?.$id}
        placeholder={placeholder}
        required={required}
        value={formData ?? ''}
        onChange={({ target: { value } }) => onChange(value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- preserves original ui:autofocus behavior from MUI TextField inputProps
        autoFocus={autoFocus}
        className={cn(
          'mt-1',
          rawErrors?.length > 0 &&
            !formData &&
            'border-destructive focus-visible:ring-destructive',
        )}
      />
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};
