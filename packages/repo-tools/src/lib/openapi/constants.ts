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

export const YAML_SCHEMA_PATH = 'src/schema/openapi.yaml';

export const OUTPUT_PATH = 'src/schema/openapi/generated';

export const OLD_SCHEMA_PATH = `src/schema/openapi.generated.ts`;

export const TS_SCHEMA_PATH = `${OUTPUT_PATH}/router.ts`;

export const OPENAPI_IGNORE_FILES = [
  // Get rid of the default files.
  '*.md',
  '*.mustache',
  // The rest of these have to be explicit, otherwise they get added if this was a *.*
  'apis/baseapi.ts',
  'apis/exception.ts',
  'auth/*',
  'http/*',
  'middleware.ts',
  'servers.ts',
  'util.ts',
  'configuration.ts',
  'rxjsStub.ts',
  '.gitignore',

  // Override the created version.
  'apis/*.ts',
  '!apis/*.client.ts',
  '!apis/*.server.ts',
  'models/*.ts',
  '!models/*.model.ts',

  // Always include index.ts files.
  '!index.ts',
  '!**/index.ts',

  // Weird API typings.
  'types/ObjectParamAPI.ts',
  'types/ObservableAPI.ts',
  'types/PromiseAPI.ts',

  'git_push.sh',
  'package.json',
  'tsconfig.json',
];
