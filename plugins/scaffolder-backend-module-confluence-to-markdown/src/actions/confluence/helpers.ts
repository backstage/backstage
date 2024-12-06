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

import { Config } from '@backstage/config';
import { ResponseError, ConflictError, InputError } from '@backstage/errors';
import fs from 'fs-extra';
import { Readable } from 'stream';

interface Links {
  webui: string;
  download: string;
  thumbnail: string;
  self: string;
}

interface Metadata {
  mediaType: string;
}

export interface Result {
  id: string;
  type: string;
  status: string;
  title: string;
  metadata: Metadata;
  _links: Links;
}

export interface Results {
  results: Result[];
}

export type LocalConfluenceConfig = {
  baseUrl: string;
  auth: string;
  token?: string;
  email?: string;
  username?: string;
  password?: string;
};

export const getConfluenceConfig = (config: Config) => {
  const confluenceConfig = {
    baseUrl: config.getString('confluence.baseUrl'),
    auth: config.getOptionalString('confluence.auth.type') ?? 'bearer',
    token: config.getOptionalString('confluence.auth.token'),
    email: config.getOptionalString('confluence.auth.email'),
    username: config.getOptionalString('confluence.auth.username'),
    password: config.getOptionalString('confluence.auth.password'),
  };

  if (
    (confluenceConfig.auth === 'basic' || confluenceConfig.auth === 'bearer') &&
    !confluenceConfig.token
  ) {
    throw new Error(
      `No token provided for the configured '${confluenceConfig.auth}' auth method`,
    );
  }

  if (confluenceConfig.auth === 'basic' && !confluenceConfig.email) {
    throw new Error(
      `No email provided for the configured '${confluenceConfig.auth}' auth method`,
    );
  }

  if (
    confluenceConfig.auth === 'userpass' &&
    (!confluenceConfig.username || !confluenceConfig.password)
  ) {
    throw new Error(
      `No username/password provided for the configured '${confluenceConfig.auth}' auth method`,
    );
  }

  return confluenceConfig;
};

export const getAuthorizationHeaderValue = (config: LocalConfluenceConfig) => {
  switch (config.auth) {
    case 'bearer':
      return `Bearer ${config.token}`;
    case 'basic': {
      const buffer = Buffer.from(`${config.email}:${config.token}`, 'utf8');
      return `Basic ${buffer.toString('base64')}`;
    }
    case 'userpass': {
      const buffer = Buffer.from(
        `${config.username}:${config.password}`,
        'utf8',
      );
      return `Basic ${buffer.toString('base64')}`;
    }
    default:
      throw new Error(`Unknown auth method '${config.auth}' provided`);
  }
};

export const readFileAsString = async (fileDir: string) => {
  const content = await fs.readFile(fileDir, 'utf-8');
  return content.toString();
};

export const fetchConfluence = async (
  relativeUrl: string,
  config: LocalConfluenceConfig,
) => {
  const baseUrl = config.baseUrl;
  const authHeaderValue = getAuthorizationHeaderValue(config);
  const url = `${baseUrl}${relativeUrl}`;
  const response: Response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: authHeaderValue,
    },
  });
  if (!response.ok) {
    throw await ResponseError.fromResponse(response);
  }

  return response.json();
};

export const getAndWriteAttachments = async (
  arr: Results,
  workspace: string,
  config: LocalConfluenceConfig,
  mkdocsDir: string,
) => {
  const productArr: string[][] = [];
  const baseUrl = config.baseUrl;
  const authHeaderValue = getAuthorizationHeaderValue(config);
  await Promise.all(
    await arr.results.map(async (result: Result) => {
      const downloadLink = result._links.download;
      const downloadTitle = result.title.replace(/ /g, '-');
      if (result.metadata.mediaType !== 'application/gliffy+json') {
        productArr.push([result.title.replace(/ /g, '%20'), downloadTitle]);
      }
      const url = `${baseUrl}${downloadLink}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authHeaderValue,
        },
      });
      if (!res.ok) {
        throw await ResponseError.fromResponse(res);
      } else if (res.body !== null) {
        fs.openSync(`${workspace}/${mkdocsDir}docs/img/${downloadTitle}`, 'w');
        const writeStream = fs.createWriteStream(
          `${workspace}/${mkdocsDir}docs/img/${downloadTitle}`,
        );
        // TODO(freben): This cast is sketchy, but for some reason the node types don't quite line up here
        // https://stackoverflow.com/questions/44672942/stream-response-to-file-using-fetch-api-and-fs-createwritestream/73879265#73879265
        Readable.fromWeb(res.body as any).pipe(writeStream);
        await new Promise((resolve, reject) => {
          writeStream.on('finish', () => {
            resolve(`${workspace}/${mkdocsDir}docs/img/${downloadTitle}`);
          });
          writeStream.on('error', reject);
        });
      } else {
        throw new ConflictError(
          'No Body on the response. Can not save images from Confluence Doc',
        );
      }
    }),
  );
  return productArr;
};

export const createConfluenceVariables = (url: string) => {
  let spacekey: string | undefined = undefined;
  let title: string | undefined = undefined;
  let titleWithSpaces: string | undefined = '';
  const params = new URL(url);
  if (params.pathname.split('/')[1] === 'display') {
    // https://confluence.example.com/display/SPACEKEY/Page+Title
    spacekey = params.pathname.split('/')[2];
    title = params.pathname.split('/')[3];
    titleWithSpaces = title?.replace(/\+/g, ' ');
    return { spacekey, title, titleWithSpaces };
  } else if (params.pathname.split('/')[2] === 'display') {
    // https://confluence.example.com/prefix/display/SPACEKEY/Page+Title
    spacekey = params.pathname.split('/')[3];
    title = params.pathname.split('/')[4];
    titleWithSpaces = title?.replace(/\+/g, ' ');
    return { spacekey, title, titleWithSpaces };
  } else if (params.pathname.split('/')[2] === 'spaces') {
    // https://example.atlassian.net/wiki/spaces/SPACEKEY/pages/1234567/Page+Title
    spacekey = params.pathname.split('/')[3];
    title = params.pathname.split('/')[6];
    titleWithSpaces = title?.replace(/\+/g, ' ');
    return { spacekey, title, titleWithSpaces };
  }
  throw new InputError(
    'The Url format for Confluence is incorrect. Acceptable format is `<CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE>` or `<CONFLUENCE_BASE_URL>/spaces/<SPACEKEY>/pages/<PAGEID>/<PAGE+TITLE>` for Confluence cloud',
  );
};
