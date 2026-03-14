/*
 * Copyright 2023 The Backstage Authors
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
import {
  ScaffolderRJSFFieldProps,
  useTemplateSecrets,
} from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderField,
  SecretWidget,
  useScaffolderTheme,
} from '@backstage/plugin-scaffolder-react/alpha';
import { PasswordField } from '@backstage/ui';
import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';

export const SecretInput = (props: ScaffolderRJSFFieldProps) => {
  const theme = useScaffolderTheme();
  const {
    name,
    onChange,
    schema: { title, description, minLength, maxLength },
    rawErrors,
    disabled,
    errors,
    required,
    uiSchema,
  } = props;

  const { setSecrets, secrets } = useTemplateSecrets();
  const [localValue, setLocalValue] = useState(secrets[name] ?? '');

  const debouncedSetSecrets = useMemo(
    () =>
      debounce((value: string) => {
        setSecrets({ [name]: value });
      }, 300),
    [setSecrets, name],
  );

  useEffect(() => {
    return () => {
      debouncedSetSecrets.cancel();
    };
  }, [debouncedSetSecrets]);

  const handleChange = (value: string) => {
    setLocalValue(value);
    onChange(Array(value.length).fill('*').join(''));
    debouncedSetSecrets(value);
  };

  if (theme === 'bui') {
    return (
      <ScaffolderField
        rawErrors={rawErrors}
        rawDescription={uiSchema['ui:description'] ?? description}
        disabled={disabled}
        errors={errors}
        required={required}
      >
        <PasswordField
          label={title}
          secondaryLabel={required ? 'Required' : undefined}
          onChange={handleChange}
          value={localValue}
          autoComplete="off"
          isRequired={required}
          isDisabled={disabled}
          isInvalid={rawErrors && rawErrors.length > 0}
          minLength={minLength}
          maxLength={maxLength}
        />
      </ScaffolderField>
    );
  }

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
      disabled={disabled}
      errors={errors}
      required={required}
    >
      <SecretWidget {...props} />
    </ScaffolderField>
  );
};
