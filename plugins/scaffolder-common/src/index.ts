/*
 * Copyright 2020 The Backstage Authors
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

/**
 * Common functionalities for the scaffolder, to be shared between scaffolder and scaffolder-backend plugin
 *
 * @packageDocumentation
 */

import { JSONSchema } from '@backstage/catalog-model';
import v1beta3Schema from './Template.v1beta3.schema.json';

export type { TemplateEntityV1beta3 } from './TemplateEntityV1beta3';

/** @public */
export const templateEntityV1beta3Schema: JSONSchema = v1beta3Schema as Omit<
  JSONSchema,
  'examples'
>;
