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
import { JsonObject, JsonValue } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';
import { BackstageCredentials } from '@backstage/backend-plugin-api';

/**
 * @alpha
 */
export type ActionsServiceAction = {
  id: string;
  name: string;
  title: string;
  description: string;
  schema: {
    input: JSONSchema7;
    output: JSONSchema7;
  };
  attributes: {
    readOnly: boolean;
    destructive: boolean;
    idempotent: boolean;
  };
};

/**
 * @alpha
 */
export interface ActionsService {
  list: (opts: {
    credentials: BackstageCredentials;
  }) => Promise<{ actions: ActionsServiceAction[] }>;
  invoke(opts: {
    id: string;
    input?: JsonObject;
    credentials: BackstageCredentials;
  }): Promise<{ output: JsonValue }>;
}
