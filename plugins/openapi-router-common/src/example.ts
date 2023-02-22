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
import express, { Router } from 'express';
import { ApiRouter, DeepWriteable } from './router';
import doc from './schema/petstore';

interface RouterOptions {}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  console.log(options);
  const router = Router() as ApiRouter<DeepWriteable<typeof doc>>;

  router.get('/pets/:uid', (req, res) => {
    res.json({
      id: 1,
      name: req.params.uid,
    });
  });

  // router.get('/pet') will complain with a TS error

  router.post('/pets', (_, res) => {
    res.send();
  });
  return router;
}
