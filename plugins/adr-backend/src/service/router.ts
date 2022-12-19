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

import { UrlReader } from '@backstage/backend-common';
import express from 'express';
import Router from 'express-promise-router';

export async function createRouter(reader: UrlReader): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/getAdrFilesAtUrl', async (req, res) => {
    const urlToProcess = req.query.url as string;
    if (!urlToProcess) {
      res.statusCode = 400;
      res.json({ message: 'No URL provided' });
      return;
    }

    const treeGetResponse = await reader.readTree(urlToProcess);
    const files = await treeGetResponse.files();
    const fileData = files.map(file => {
      return {
        type: 'file',
        name: file.path.substring(file.path.lastIndexOf('/') + 1),
        path: file.path,
      };
    });

    res.json({ data: fileData });
  });

  router.get('/readAdrFileAtUrl', async (req, res) => {
    const urlToProcess = req.query.url as string;
    if (!urlToProcess) {
      res.statusCode = 400;
      res.json({ message: 'No URL provided' });
      return;
    }

    const fileGetResponse = await reader.readUrl(urlToProcess);
    const fileBuffer = await fileGetResponse.buffer();

    res.json({ data: fileBuffer.toString() });
  });

  return router;
}
