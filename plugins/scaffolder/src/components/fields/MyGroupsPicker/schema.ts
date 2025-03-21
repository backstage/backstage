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

import { z } from 'zod';
import { makeFieldSchemaFromZod } from '../utils';

/**
 * Field schema for the MyGroupsPicker.
 * @public
 */

export const MyGroupsPickerFieldSchema = makeFieldSchemaFromZod(
  z.string(),
  z.object({
    title: z.string().default('Group').describe('Group'),
    description: z
      .string()
      .default('A group you are part of')
      .describe('The group to which the entity belongs'),
  }),
);

/**
 * UI options for the MyGroupsPicker.
 * @public
 */

export type MyGroupsPickerUiOptions =
  typeof MyGroupsPickerFieldSchema.uiOptionsType;
/**
 * Props for the MyGroupsPicker.
 * @public
 */

export type MyGroupsPickerProps = typeof MyGroupsPickerFieldSchema.type;

/**
 * Schema for the MyGroupsPicker.
 * @public
 */

export const MyGroupsPickerSchema = MyGroupsPickerFieldSchema.schema;
