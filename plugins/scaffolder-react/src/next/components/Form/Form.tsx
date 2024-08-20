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
import React from 'react';
import { PropsWithChildren } from 'react';
import { FieldTemplate } from './FieldTemplate';
import { DescriptionFieldTemplate } from './DescriptionFieldTemplate';
import { FieldProps } from '@rjsf/utils';
import { ScaffolderRJSFFormProps } from '@backstage/plugin-scaffolder-react';
import { Theme as MuiTheme } from '@rjsf/material-ui';

const WrappedForm = withTheme(MuiTheme);

/**
 * The Form component
 * @alpha
 */
export const Form = (props: PropsWithChildren<ScaffolderRJSFFormProps>) => {
  // This is where we unbreak the changes from RJSF, and make it work with our custom fields so we don't pass on this
  // breaking change to our users. We will look more into a better API for this in scaffolderv2.
  const wrappedFields = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props.fields ?? {}).map(([key, Component]) => [
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
    [props.fields],
  );

  const templates = React.useMemo(
    () => ({
      FieldTemplate,
      DescriptionFieldTemplate,
      ...props.templates,
    }),
    [props.templates],
  );

  return (
    <WrappedForm {...props} templates={templates} fields={wrappedFields} />
  );
};
