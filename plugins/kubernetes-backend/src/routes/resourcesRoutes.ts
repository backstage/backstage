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
import { InputError } from '@backstage/errors';
import express, { Request } from 'express';
import { KubernetesObjectsProvider } from '@backstage/plugin-kubernetes-node';
import { AuthService, HttpAuthService } from '@backstage/backend-plugin-api';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { requirePermission } from '../auth/requirePermission';
import { kubernetesResourcesReadPermission } from '@backstage/plugin-kubernetes-common';

export const addResourceRoutesToRouter = (
  router: express.Router,
  catalogApi: CatalogApi,
  objectsProvider: KubernetesObjectsProvider,
  auth: AuthService,
  httpAuth: HttpAuthService,
  permissionApi: PermissionEvaluator,
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

    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await httpAuth.credentials(req),
      targetPluginId: 'catalog',
    });

    const entity = await catalogApi.getEntityByRef(entityRef, { token });
    if (!entity) {
      throw new InputError(
        `Entity ref missing, ${stringifyEntityRef(entityRef)}`,
      );
    }

    return entity;
  };

  router.post('/resources/workloads/query', async (req, res) => {
    await requirePermission(
      permissionApi,
      kubernetesResourcesReadPermission,
      httpAuth,
      req,
    );
    const entity = await getEntityByReq(req);
    const response = await objectsProvider.getKubernetesObjectsByEntity(
      {
        entity,
        auth: req.body.auth,
      },
      { credentials: await httpAuth.credentials(req) },
    );
    res.json(response);
  });

  router.post('/resources/custom/query', async (req, res) => {
    await requirePermission(
      permissionApi,
      kubernetesResourcesReadPermission,
      httpAuth,
      req,
    );
    const entity = await getEntityByReq(req);

    if (!req.body.customResources) {
      throw new InputError('customResources is a required field');
    } else if (!Array.isArray(req.body.customResources)) {
      throw new InputError('customResources must be an array');
    } else if (req.body.customResources.length === 0) {
      throw new InputError('at least 1 customResource is required');
    }

    const response = await objectsProvider.getCustomResourcesByEntity(
      {
        entity,
        customResources: req.body.customResources,
        auth: req.body.auth,
      },
      { credentials: await httpAuth.credentials(req) },
    );
    res.json(response);
  });
};
