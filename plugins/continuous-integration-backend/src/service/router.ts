/*
 * Copyright 2024 The Backstage Authors
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
import Router from 'express-promise-router';
import { AggregateCiClient } from '../client/AggregateContinuousIntegrationClient';

export async function createRouter() {
  const router = Router();
  const aggregateCiClient = new AggregateCiClient();

  router.use('/:kind/:namespace/:name/builds', (req, res) => {
    const { kind, namespace, name } = req.params;
    const { branch, limit } = req.query;

    // get entity from catalog, pass to below.
    const entity = { kind, namespace, name } as any;

    return aggregateCiClient.getBuilds(
      entity,
      branch as string,
      +(limit as string),
    );
  });

  return router;
}
