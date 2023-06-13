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

import { FormProps, withTheme } from '@rjsf/core';
import React from 'react';
import { PropsWithChildren } from 'react';
import { Theme } from '@rjsf/material-ui';
import { FieldTemplate } from './FieldTemplate';
import { DescriptionFieldTemplate } from './DescriptionFieldTemplate';

const WrappedForm = withTheme(Theme);

/**
 * The Form component
 * @alpha
 */
export const Form = (props: PropsWithChildren<FormProps>) => {
  const templates = {
    FieldTemplate,
    DescriptionFieldTemplate,
    ...props.templates,
  };
  return <WrappedForm {...props} templates={templates} />;
};
