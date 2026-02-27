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

import { withTheme } from '@rjsf/core';
import { useMemo, PropsWithChildren } from 'react';
import { FieldTemplate } from './FieldTemplate';
import { DescriptionFieldTemplate } from './DescriptionFieldTemplate';
import { FieldProps } from '@rjsf/utils';
import {
  ScaffolderRJSFFormProps,
  type FormProps,
} from '@backstage/plugin-scaffolder-react';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import { generateBuiTheme } from './BuiTheme';
import {
  ScaffolderThemeProvider,
  type ScaffolderTheme,
} from './ScaffolderThemeContext';

const MuiForm = withTheme(MuiTheme);
const BuiForm = withTheme(generateBuiTheme());

/**
 * The Form component
 * @alpha
 */
export const Form = (
  props: PropsWithChildren<
    ScaffolderRJSFFormProps & Pick<FormProps, 'EXPERIMENTAL_theme'>
  >,
) => {
  const { EXPERIMENTAL_theme: themeProp, ...formProps } = props;
  const theme: ScaffolderTheme = themeProp ?? 'mui';
  const WrappedForm = theme === 'bui' ? BuiForm : MuiForm;

  // This is where we unbreak the changes from RJSF, and make it work with our custom fields so we don't pass on this
  // breaking change to our users. We will look more into a better API for this in scaffolderv2.
  const wrappedFields = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(formProps.fields ?? {}).map(([key, Component]) => [
          key,
          (wrapperProps: FieldProps) => {
            return (
              <Component
                {...wrapperProps}
                uiSchema={wrapperProps.uiSchema ?? {}}
                formData={wrapperProps.formData}
                rawErrors={wrapperProps.rawErrors ?? []}
                disabled={wrapperProps.disabled ?? false}
                readonly={wrapperProps.readonly ?? false}
              />
            );
          },
        ]),
      ),
    [formProps.fields],
  );

  const templates = useMemo(
    () =>
      theme === 'bui'
        ? formProps.templates ?? {}
        : {
            FieldTemplate,
            DescriptionFieldTemplate,
            ...formProps.templates,
          },
    [formProps.templates, theme],
  );

  return (
    <ScaffolderThemeProvider value={theme}>
      <WrappedForm
        {...formProps}
        templates={templates}
        fields={wrappedFields}
      />
    </ScaffolderThemeProvider>
  );
};
