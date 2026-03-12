/*
 * Copyright 2025 The Backstage Authors
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

import type { Entity } from '../entity/Entity';
import schema from '../schema/kinds/API.v1alpha2.schema.json';
import { ajvCompiledJsonSchemaValidator } from './util';

/**
 * The specification fields that vary based on the API type.
 *
 * @public
 */
export type ApiEntityV1alpha2Spec =
  | {
      type: 'mcp-server';
      remotes: { type: string; url: string }[];
    }
  | { type: string; definition: string };

/**
 * Backstage API kind Entity using the v1alpha2 schema.
 *
 * @remarks
 *
 * This version supports structured spec fields that vary by API type.
 * MCP server entities use a remotes array instead of a definition string.
 * The JSON schema enforces the correct fields based on spec.type.
 *
 * See {@link https://backstage.io/docs/features/software-catalog/system-model}
 *
 * @public
 */
export interface ApiEntityV1alpha2 extends Entity {
  apiVersion: 'backstage.io/v1alpha2';
  kind: 'API';
  spec: {
    lifecycle: string;
    owner: string;
    system?: string;
  } & ApiEntityV1alpha2Spec;
}

/**
 * {@link KindValidator} for {@link ApiEntityV1alpha2}.
 *
 * @public
 */
export const apiEntityV1alpha2Validator =
  ajvCompiledJsonSchemaValidator(schema);
