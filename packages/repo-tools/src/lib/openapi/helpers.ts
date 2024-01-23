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

export const getPathToFile = async (directory: string, filename: string) => {
  return resolve(directory, filename);
};

export const getRelativePathToFile = async (filename: string) => {
  return await getPathToFile(paths.targetDir, filename);
};

export const assertExists = async (path: string) => {
  if (!(await pathExists(path))) {
    throw new Error(`Could not find ${path}.`);
  }
  return path;
};

export const getPathToOpenApiSpec = async (directory: string) => {
  return await assertExists(await getPathToFile(directory, YAML_SCHEMA_PATH));
};

export const getPathToCurrentOpenApiSpec = async () => {
  return await assertExists(await getRelativePathToFile(YAML_SCHEMA_PATH));
};
