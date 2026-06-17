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

import { makeFieldSchema } from '@backstage/plugin-scaffolder-react';

/**
 * Field schema for the MyGroupsPicker.
 * @public
 */

export const MyGroupsPickerFieldSchema = makeFieldSchema({
  output: z => z.string(),
});

/**
 * UI options for the MyGroupsPicker.
 * @public
 */

export type MyGroupsPickerUiOptions = NonNullable<
  (typeof MyGroupsPickerFieldSchema.TProps.uiSchema)['ui:options']
>;

/**
 * Props for the MyGroupsPicker.
 */
export type MyGroupsPickerProps = typeof MyGroupsPickerFieldSchema.TProps;

/**
 * Schema for the MyGroupsPicker.
 * @public
 */
export const MyGroupsPickerSchema = MyGroupsPickerFieldSchema.schema;
