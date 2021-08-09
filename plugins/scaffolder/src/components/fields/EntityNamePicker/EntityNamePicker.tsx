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
import React from 'react';
import { FieldProps } from '@rjsf/core';
import { TextValuePicker } from '../TextValuePicker';

export const EntityNamePicker = ({
  schema: { title = 'Name', description = 'Unique name of the component' },
  ...props
}: FieldProps<string>) => (
  <TextValuePicker schema={{ title, description }} {...props} />
);
