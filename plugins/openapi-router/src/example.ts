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
import express from 'express';
import Router from 'express-promise-router';
import { ApiRouter } from './router';
import doc from './schema/petstore';

interface RouterOptions {}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  console.log(options);
  const router = Router() as ApiRouter<typeof doc>;

  router.get('/pets/:petId', (_, res) => {
    res.json({
      id: 1,
      name: 'test',
    });
  });

  router.get('/pets', (_, res) => {
    res.json([
      {
        id: 1,
        tag: '123',
        name: 'test',
      },
    ]);
  });

  router.post('/pets', (_, res) => {
    res.send();
  });
  return router;
}
