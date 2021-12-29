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
 * TemplateMetadata
 *
 * @public
 */
export type TemplateMetadata = {
  name: string;
};

/**
 * TaskStep
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
 * TaskSpecV1beta2
 *
 * @public
 */
export interface TaskSpecV1beta2 {
  apiVersion: 'backstage.io/v1beta2';
  baseUrl?: string;
  values: JsonObject;
  steps: TaskStep[];
  output: { [name: string]: string };
  metadata?: TemplateMetadata;
}

/**
 * TaskSpecV1beta3
 *
 * @public
 */
export interface TaskSpecV1beta3 {
  apiVersion: 'scaffolder.backstage.io/v1beta3';
  baseUrl?: string;
  parameters: JsonObject;
  steps: TaskStep[];
  output: { [name: string]: JsonValue };
  metadata?: TemplateMetadata;
}

/**
 * TaskSpec
 *
 * @public
 */
export type TaskSpec = TaskSpecV1beta2 | TaskSpecV1beta3;
