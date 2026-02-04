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

import Parser from '@apidevtools/swagger-parser';
import fs, { pathExists } from 'fs-extra';
import YAML from 'js-yaml';
import { cloneDeep } from 'lodash';
import { resolve } from 'node:path';
import { paths } from '../paths';
import { YAML_SCHEMA_PATH } from './constants';

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

export async function loadAndValidateOpenApiYaml(path: string) {
  const yaml = YAML.load(await fs.readFile(path, 'utf8'));
  await Parser.validate(cloneDeep(yaml) as any);
  return yaml;
}

export function toGeneratorAdditionalProperties({
  initialValue,
  defaultValue,
}: {
  initialValue?: string;
  defaultValue?: Record<string, any>;
}) {
  const items = initialValue?.split(',') ?? [];
  const parsed = items.reduce(
    (acc, item) => {
      const [key, value] = item.split('=');
      return { ...acc, [key]: value };
    },
    { ...defaultValue },
  );
  return Object.entries(parsed)
    .map(([key, value]) => `${key}=${value}`)
    .join(',');
}

export async function getOpenApiGeneratorKey(
  specPath: string,
): Promise<string> {
  const yaml = (await loadAndValidateOpenApiYaml(specPath)) as any;
  const version = yaml.openapi;

  if (!version) {
    throw new Error(`Could not determine OpenAPI version from ${specPath}`);
  }

  const semver = /^(\d+)\.(\d+)\.(\d+)(-.+)?$/.exec(version);
  if (!semver) {
    throw new Error(`Invalid OpenAPI version format ${version} in ${specPath}`);
  }
  const [, major, minor] = semver;
  const supportedVersions = ['3.0', '3.1'];

  const majorMinor = `${major}.${minor}`;
  if (!supportedVersions.includes(majorMinor)) {
    throw new Error(
      `Unsupported OpenAPI version ${version} in ${specPath}. Supported versions are: ${supportedVersions.join(
        ', ',
      )}`,
    );
  }

  return `v${majorMinor}`;
}
