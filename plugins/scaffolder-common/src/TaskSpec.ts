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

import { JsonValue, JsonObject } from '@backstage/types';

/**
 * Metadata about the Template that was the originator of a scaffolder task, as
 * stored in the database.
 *
 * @public
 * @deprecated use templateInfo on the spec instead
 */
export type TemplateMetadata = {
  name: string;
};

/**
 * Information about a template that is stored on a task specification.
 * Includes a stringified entityRef, and the baseUrl which is usually the relative path of the template definition
 *
 * @public
 */
export type TemplateInfo = {
  entityRef: string;
  baseUrl?: string;
};

/**
 * An individual step of a scaffolder task, as stored in the database.
 *
 * @public
 */
export interface TaskStep {
  id: string;
  name: string;
  action: string;
  input?: JsonObject;
  if?: string | boolean;
}

/**
 * A scaffolder task as stored in the database, generated from a v1beta2
 * apiVersion Template.
 *
 * @public
 * @deprecated Please convert your templates to TaskSpecV1beta3 on apiVersion
 *             scaffolder.backstage.io/v1beta3
 */
export interface TaskSpecV1beta2 {
  apiVersion: 'backstage.io/v1beta2';
  /** @deprecated use templateInfo.baseUrl instead */
  baseUrl?: string;
  values: JsonObject;
  steps: TaskStep[];
  output: { [name: string]: string };
  /** @deprecated use templateInfo instead */
  metadata?: TemplateMetadata;
  templateInfo?: TemplateInfo;
}

/**
 * A scaffolder task as stored in the database, generated from a v1beta3
 * apiVersion Template.
 *
 * @public
 */
export interface TaskSpecV1beta3 {
  apiVersion: 'scaffolder.backstage.io/v1beta3';
  /** @deprecated use templateInfo.baseUrl instead */
  baseUrl?: string;
  parameters: JsonObject;
  steps: TaskStep[];
  output: { [name: string]: JsonValue };
  /** @deprecated use templateInfo instead */
  metadata?: TemplateMetadata;
  templateInfo?: TemplateInfo;
}

/**
 * A scaffolder task as stored in the database, generated from a Template.
 *
 * @public
 */
export type TaskSpec = TaskSpecV1beta2 | TaskSpecV1beta3;
