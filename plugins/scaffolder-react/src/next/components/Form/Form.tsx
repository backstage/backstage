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

import { FormProps, withTheme } from '@rjsf/core-v5';
import React from 'react';
import { PropsWithChildren } from 'react';
import { FieldTemplate } from './FieldTemplate';
import { DescriptionFieldTemplate } from './DescriptionFieldTemplate';
import { FieldProps } from '@rjsf/utils';

// TODO(blam): We require here, as the types in this package depend on @rjsf/core explicitly
// which is what we're using here as the default types, it needs to depend on @rjsf/core-v5 because
// of the re-writing we're doing. Once we've migrated, we can import this the exact same as before.
const WrappedForm = withTheme(require('@rjsf/material-ui-v5').Theme);

/**
 * The Form component
 * @alpha
 */
export const Form = (props: PropsWithChildren<FormProps>) => {
  // This is where we unbreak the changes from RJSF, and make it work with our custom fields so we don't pass on this
  // breaking change to our users. We will look more into a better API for this in scaffolderv2.
  const wrappedFields = Object.fromEntries(
    Object.entries(props.fields ?? {}).map(([key, Component]) => [
      key,
      (wrapperProps: FieldProps) => {
        return (
          <Component
            {...wrapperProps}
            uiSchema={wrapperProps.uiSchema ?? {}}
            formData={wrapperProps.formData ?? {}}
            rawErrors={wrapperProps.rawErrors ?? []}
          />
        );
      },
    ]),
  );

  const templates = {
    FieldTemplate,
    DescriptionFieldTemplate,
    ...props.templates,
  };

  return (
    <WrappedForm {...props} templates={templates} fields={wrappedFields} />
  );
};
