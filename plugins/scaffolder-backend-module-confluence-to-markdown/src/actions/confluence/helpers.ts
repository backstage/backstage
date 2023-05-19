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
import fetch, { Response } from 'node-fetch';

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

export const readFileAsString = async (fileDir: string) => {
  const content = await fs.readFile(fileDir, 'utf-8');
  return content.toString();
};

export const fetchConfluence = async (relativeUrl: string, config: Config) => {
  const baseUrl = config.getString('confluence.baseUrl');
  const token = config.getString('confluence.token');
  const response: Response = await fetch(`${baseUrl}${relativeUrl}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
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
  config: Config,
  mkdocsDir: string,
) => {
  const productArr: string[][] = [];
  const baseUrl = config.getString('confluence.baseUrl');
  const token = config.getString('confluence.token');
  await Promise.all(
    await arr.results.map(async (result: Result) => {
      const downloadLink = result._links.download;
      const downloadTitle = result.title.replace(/ /g, '-');
      if (result.metadata.mediaType !== 'application/gliffy+json') {
        productArr.push([result.title.replace(/ /g, '%20'), downloadTitle]);
      }

      const res = await fetch(`${baseUrl}${downloadLink}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw await ResponseError.fromResponse(res);
      } else if (res.body !== null) {
        fs.openSync(`${workspace}/${mkdocsDir}docs/img/${downloadTitle}`, 'w');
        const writeStream = fs.createWriteStream(
          `${workspace}/${mkdocsDir}docs/img/${downloadTitle}`,
        );
        res.body.pipe(writeStream);
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

export const createConfluenceVariables = async (url: string) => {
  let spacekey: string | undefined = undefined;
  let title: string | undefined = undefined;
  let titleWithSpaces: string | undefined = '';
  const params = new URL(url);
  if (params.pathname.split('/')[1] === 'display') {
    spacekey = params.pathname.split('/')[2];
    title = params.pathname.split('/')[3];
    titleWithSpaces = title?.replace(/\+/g, ' ');
    return { spacekey, title, titleWithSpaces };
  }
  throw new InputError(
    'The Url format for Confluence is incorrect. Acceptable format is `<CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE>`',
  );
};
