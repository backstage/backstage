/*
 * Copyright 2024 The Backstage Authors
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

import { pathExists } from 'fs-extra';
import { paths } from '../paths';
import { YAML_SCHEMA_PATH } from './constants';
import { resolve } from 'path';

export const getPathToOpenApiSpec = async (directory: string) => {
  const openapiPath = resolve(directory, YAML_SCHEMA_PATH);
  if (!(await pathExists(openapiPath))) {
    throw new Error(`Could not find ${YAML_SCHEMA_PATH}.`);
  }
  return openapiPath;
};

export const getPathToCurrentOpenApiSpec = async () => {
  return await getPathToOpenApiSpec(paths.targetDir);
};
