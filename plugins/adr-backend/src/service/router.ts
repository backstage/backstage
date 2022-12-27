/*
 * Copyright 2022 The Backstage Authors
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

import { CacheClient, UrlReader } from '@backstage/backend-common';
import { NotModifiedError, stringifyError } from '@backstage/errors';
import { Logger } from 'winston';
import express from 'express';
import Router from 'express-promise-router';

/** @public */
export type AdrRouterOptions = {
  reader: UrlReader;
  cacheClient: CacheClient;
  logger: Logger;
};

/** @public */
export async function createRouter(
  options: AdrRouterOptions,
): Promise<express.Router> {
  const { reader, cacheClient, logger } = options;

  const router = Router();
  router.use(express.json());

  router.get('/list', async (req, res) => {
    const urlToProcess = req.query.url as string;
    if (!urlToProcess) {
      res.statusCode = 400;
      res.json({ message: 'No URL provided' });
      return;
    }

    const cachedTree = (await cacheClient.get(urlToProcess)) as {
      data: {
        type: string;
        name: string;
        path: string;
      }[];
      etag: string;
    };
    const cachedData = cachedTree?.data;

    try {
      const treeGetResponse = await reader.readTree(urlToProcess, {
        etag: cachedTree?.etag,
      });
      const files = await treeGetResponse.files();
      const data = files.map(file => {
        return {
          type: 'file',
          name: file.path.substring(file.path.lastIndexOf('/') + 1),
          path: file.path,
        };
      });

      await cacheClient.set(urlToProcess, {
        data,
        etag: treeGetResponse.etag,
      });

      res.json({ data });
    } catch (error: any) {
      if (cachedData && error.name === NotModifiedError.name) {
        res.json({ data: cachedData });
        return;
      }

      const message = stringifyError(error);
      logger.error(`Unable to fetch ADRs from ${urlToProcess}: ${message}`);
      res.statusCode = 500;
      res.json({ message });
    }
  });

  router.get('/file', async (req, res) => {
    const urlToProcess = req.query.url as string;
    if (!urlToProcess) {
      res.statusCode = 400;
      res.json({ message: 'No URL provided' });
      return;
    }

    const cachedFileContent = (await cacheClient.get(urlToProcess)) as {
      data: string;
      etag: string;
    };

    try {
      const fileGetResponse = await reader.readUrl(urlToProcess, {
        etag: cachedFileContent?.etag,
      });
      const fileBuffer = await fileGetResponse.buffer();
      const data = fileBuffer.toString();

      await cacheClient.set(urlToProcess, {
        data,
        etag: fileGetResponse.etag,
      });

      res.json({ data });
    } catch (error) {
      if (cachedFileContent && error.name === NotModifiedError.name) {
        res.json({ data: cachedFileContent.data });
        return;
      }

      const message = stringifyError(error);
      logger.error(`Unable to fetch ADRs from ${urlToProcess}: ${message}`);
      res.statusCode = 500;
      res.json({ message });
    }
  });

  return router;
}
