/*
 * Copyright 2025 The Backstage Authors
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
import { renderToString } from 'react-dom/server';
import { TodoListPage } from './components/TodoListPage.tsx';

export async function createRouter(): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/render', async (_, res) => {
    res.send(renderToString(<TodoListPage />));
  });

  return router;
}
