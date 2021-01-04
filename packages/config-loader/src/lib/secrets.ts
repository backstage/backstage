/*
 * Copyright 2020 Spotify AB
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

import * as yup from 'yup';
import yaml from 'yaml';
import { extname } from 'path';
import { JsonObject, JsonValue } from '@backstage/config';
import { isObject, isNever } from './utils';
import { ReaderContext } from './types';

// Reads a file and forwards the contents as is, assuming ut8 encoding
type FileSecret = {
  // Path to the secret file, relative to the config file.
  file: string;
};

// Reads the secret from an environment variable.
type EnvSecret = {
  // The name of the environment file.
  env: string;
};

// Reads a secret from a json-like file and extracts a value at a path.
// The supported extensions are define in dataSecretParser below.
type DataSecret = {
  // Path to the data secret file, relative to the config file.
  data: string;
  // The path to the value inside the data file, each element separated by '.'.
  path?: string;
};

// TODO(Rugvip): Move this out of secret reading when we remove the deprecated DataSecret and $secret format
type IncludeSecret = {
  include: string;
};

type Secret = FileSecret | EnvSecret | DataSecret | IncludeSecret;

// Schema for each type of secret description
const secretLoaderSchemas = {
  file: yup.object({
    file: yup.string().required(),
  }),
  env: yup.object({
    env: yup.string().required(),
  }),
  data: yup.object({
    data: yup.string().required(),
  }),
  include: yup.object({
    include: yup.string().required(),
  }),
};

// The top-level secret schema, which figures out what type of secret it is.
const secretSchema = yup.lazy<object | undefined>(value => {
  if (typeof value !== 'object' || value === null) {
    return yup.object().required().label('secret');
  }

  const loaderTypes = Object.keys(
    secretLoaderSchemas,
  ) as (keyof typeof secretLoaderSchemas)[];

  for (const key of loaderTypes) {
    if (key in value) {
      return secretLoaderSchemas[key];
    }
  }
  throw new yup.ValidationError(
    `Secret must contain one of '${loaderTypes.join("', '")}'`,
    value,
    '$secret',
  );
});

// Parsers for each type of data secret file.
const dataSecretParser: {
  [ext in string]: (content: string) => Promise<JsonObject>;
} = {
  '.json': async content => JSON.parse(content),
  '.yaml': async content => yaml.parse(content),
  '.yml': async content => yaml.parse(content),
};

/**
 * Transforms a secret description into the actual secret value.
 */
export async function readSecret(
  data: JsonObject,
  ctx: ReaderContext,
): Promise<JsonValue | undefined> {
  const secret = secretSchema.validateSync(data, { strict: true }) as Secret;

  if ('file' in secret) {
    return ctx.readFile(secret.file);
  }
  if ('env' in secret) {
    return ctx.env[secret.env];
  }
  if ('data' in secret) {
    console.warn(
      `Configuration uses deprecated $data key, use $include instead.`,
    );
    const url =
      'path' in secret ? `${secret.data}#${secret.path}` : secret.data;
    const [filePath, dataPath] = url.split(/#(.*)/);
    if (!dataPath) {
      throw new Error(
        `Invalid format for data secret value, must be of the form <filepath>#<datapath>, got '${url}'`,
      );
    }

    const ext = extname(filePath);
    const parser = dataSecretParser[ext];
    if (!parser) {
      throw new Error(`No data secret parser available for extension ${ext}`);
    }

    const content = await ctx.readFile(filePath);

    const parts = dataPath.split('.');

    let value: JsonValue | undefined = await parser(content);
    for (const [index, part] of parts.entries()) {
      if (!isObject(value)) {
        const errPath = parts.slice(0, index).join('.');
        throw new Error(`Value is not an object at ${errPath} in ${filePath}`);
      }
      value = value[part];
    }

    return String(value);
  }
  if ('include' in secret) {
    const [filePath, dataPath] = secret.include.split(/#(.*)/);

    const ext = extname(filePath);
    const parser = dataSecretParser[ext];
    if (!parser) {
      throw new Error(`No data secret parser available for extension ${ext}`);
    }

    const content = await ctx.readFile(filePath);

    const parts = dataPath ? dataPath.split('.') : [];

    let value: JsonValue | undefined;
    try {
      value = await parser(content);
    } catch (error) {
      throw new Error(`Failed to parse included file ${filePath}, ${error}`);
    }
    for (const [index, part] of parts.entries()) {
      if (!isObject(value)) {
        const errPath = parts.slice(0, index).join('.');
        throw new Error(`Value is not an object at ${errPath} in ${filePath}`);
      }
      value = value[part];
    }

    return value;
  }

  isNever<typeof secret>();
  throw new Error('Secret was left unhandled');
}
