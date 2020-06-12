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

type FileSecret = {
  file: string;
};

type EnvSecret = {
  env: string;
};

type DataSecret = {
  data: string;
  path: string | string[];
};

type Secret = FileSecret | EnvSecret | DataSecret;

const secretLoaderSchemas = {
  file: yup.object({
    file: yup.string().required(),
  }),
  env: yup.object({
    env: yup.string().required(),
  }),
  data: yup.object({
    data: yup.string().required(),
    path: yup.lazy(value => {
      if (typeof value === 'string') {
        return yup.string().required();
      }
      return yup.array().of(yup.string().required()).required();
    }),
  }),
};

const secretSchema = yup.lazy<object>(value => {
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

const dataSecretParser: {
  [ext in string]: (content: string) => Promise<JsonObject>;
} = {
  '.json': async content => JSON.parse(content),
  '.yaml': async content => yaml.parse(content),
  '.yml': async content => yaml.parse(content),
};

export async function readSecret(
  data: JsonObject,
  ctx: ReaderContext,
): Promise<string | undefined> {
  const secret = secretSchema.validateSync(data, { strict: true }) as Secret;

  if ('file' in secret) {
    return ctx.readFile(secret.file);
  }
  if ('env' in secret) {
    return ctx.env[secret.env];
  }
  if ('data' in secret) {
    const ext = extname(secret.data);
    const parser = dataSecretParser[ext];
    if (!parser) {
      throw new Error(`No data secret parser available for extension ${ext}`);
    }

    const content = await ctx.readFile(secret.data);

    const { path } = secret;
    const parts = typeof path === 'string' ? path.split('.') : path;

    let value: JsonValue = await parser(content);
    for (const [index, part] of parts.entries()) {
      if (!isObject(value)) {
        const errPath = parts.slice(0, index).join('.');
        throw new Error(
          `Value is not an object at ${errPath} in ${secret.data}`,
        );
      }
      value = value[part];
    }
    return String(value);
  }

  isNever<typeof secret>();
  throw new Error('Secret was left unhandled');
}
