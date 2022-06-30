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
import {
  CompoundEntityRef,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError, AuthenticationError } from '@backstage/errors';
import express, { Request } from 'express';
import { KubernetesObjectsProvider } from '../types/types';
import { Logger } from 'winston';

export const addResourceRoutesToRouter = (
  router: express.Router,
  catalogClient: CatalogApi,
  objectsProvider: KubernetesObjectsProvider,
  logger: Logger,
) => {
  const getEntityByReq = async (req: Request<any>) => {
    const rawEntityRef = req.query.entity;
    if (rawEntityRef && typeof rawEntityRef !== 'string') {
      throw new InputError(`entity query must be a string`);
    } else if (!rawEntityRef) {
      throw new InputError('entity is a required field');
    }
    let entityRef: CompoundEntityRef | undefined = undefined;

    try {
      entityRef = parseEntityRef(rawEntityRef);
    } catch (error) {
      throw new InputError(`Invalid entity ref, ${error}`);
    }

    function getBearerToken(header?: string): string | undefined {
      return header?.match(/Bearer\s+(\S+)/i)?.[1];
    }
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new AuthenticationError('No Backstage token');
    }

    const entity = await catalogClient.getEntityByRef(entityRef, {
      token: token,
    });

    if (!entity) {
      throw new InputError(`Entity ref missing, ${entityRef}`);
    }
    return entity;
  };

  router.post('/resources/workloads/query', async (req, res) => {
    const entity = await getEntityByReq(req);

    try {
      const response = await objectsProvider.getKubernetesObjectsByEntity(
        {
        entity,
        auth: req.body.auth,
        }
      );
      res.json(response);
    } catch (e) {
      logger.error(String(e), {
        action: '/resources/workloads',
        entityRef: stringifyEntityRef(entity),
      });
      res.status(500).json({ error: e.message });
    }
  });

  router.post('/resources/custom/query', async (req, res) => {
    const entity = await getEntityByReq(req);

    try {
      const response = await objectsProvider.getCustomResourcesByEntity(
        {
        entity,
        customResources: req.body.customResources,
        auth: req.body.auth,
        }
      );
      res.json(response);
    } catch (e) {
      logger.error(String(e), {
        action: '/resources/custom',
        entityRef: stringifyEntityRef(entity),
      });
      res.status(500).json({ error: e.message });
    }
  });
};
