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
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';

export const addResourceRoutesToRouter = (
  router: express.Router,
  catalogApi: CatalogApi,
  objectsProvider: KubernetesObjectsProvider,
) => {
  const getEntityByReq = async (req: Request<any>) => {
    const rawEntityRef = req.body.entityRef;
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

    const token = getBearerTokenFromAuthorizationHeader(
      req.headers.authorization,
    );

    if (!token) {
      throw new AuthenticationError('No Backstage token');
    }

    const entity = await catalogApi.getEntityByRef(entityRef, {
      token: token,
    });

    if (!entity) {
      throw new InputError(
        `Entity ref missing, ${stringifyEntityRef(entityRef)}`,
      );
    }
    return entity;
  };

  router.post('/resources/workloads/query', async (req, res) => {
    const entity = await getEntityByReq(req);
    const response = await objectsProvider.getKubernetesObjectsByEntity({
      entity,
      auth: req.body.auth,
    });
    res.json(response);
  });

  router.post('/resources/custom/query', async (req, res) => {
    const entity = await getEntityByReq(req);

    if (!req.body.customResources) {
      throw new InputError('customResources is a required field');
    } else if (!Array.isArray(req.body.customResources)) {
      throw new InputError('customResources must be an array');
    } else if (req.body.customResources.length === 0) {
      throw new InputError('at least 1 customResource is required');
    }

    const response = await objectsProvider.getCustomResourcesByEntity({
      entity,
      customResources: req.body.customResources,
      auth: req.body.auth,
    });
    res.json(response);
  });
};
