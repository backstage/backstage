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

import { TemplaterConfig, createTemplater } from './lib/templater';
import { createStorage, StorageConfig } from './lib/storage';
import express from 'express';

export const createScaffolder = (config?: TemplaterConfig & StorageConfig) => {
  const store = createStorage(config);

  const templater = createTemplater(config);

  const router = express.Router();

  router.get('/v1/templates', async (_, res) => {
    const templates = await store.list();
    res.status(200).json(templates);
  });

  router.post('/v1/job/create', async (_, res) => {
    // TODO(blam): Actually make this function work'

    const mock = 'templateid';
    res.status(201).json({ accepted: true });

    const path = await store.prepare(mock);
    await templater.run({ directory: path, values: { componentId: 'test' } });
  });

  return router;
};
