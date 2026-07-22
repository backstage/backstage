/*
 * Copyright 2026 The Backstage Authors
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
  BackstageCredentials,
  PermissionsService,
} from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { PolicyDecision } from '@backstage/plugin-permission-common';
import { findGoldenPath } from '../service/helpers';
import {
  GoldenPathEntityStepV1beta1,
  GoldenPathEntityV1beta1,
  goldenPathParameterReadPermission,
  GoldenPathParametersV1beta1,
  goldenPathStepReadPermission,
} from '@backstage/plugin-golden-paths-common';
import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { CatalogClient } from '@backstage/catalog-client';

function isSupportedGoldenPath(entity: GoldenPathEntityV1beta1) {
  return entity.apiVersion === 'backstage.io/v1beta1';
}

export async function authorizeGoldenPath(
  entityRef: CompoundEntityRef,
  token: string | undefined,
  credentials: BackstageCredentials,
  permissions: PermissionsService,
  catalogClient: CatalogClient,
  isGoldenPathAuthorized: (
    decision: PolicyDecision,
    resource: GoldenPathEntityStepV1beta1 | GoldenPathParametersV1beta1,
  ) => boolean,
) {
  const goldenPath = await findGoldenPath({
    catalogApi: catalogClient,
    entityRef,
    token,
  });

  if (!isSupportedGoldenPath(goldenPath)) {
    throw new InputError(
      `Unsupported apiVersion field in schema entity, ${
        (goldenPath as Entity).apiVersion
      }`,
    );
  }

  if (!permissions) {
    return goldenPath;
  }

  const [parameterDecision, stepDecision] =
    await permissions.authorizeConditional(
      [
        { permission: goldenPathParameterReadPermission },
        { permission: goldenPathStepReadPermission },
      ],
      { credentials },
    );

  if (Array.isArray(goldenPath.spec.parameters)) {
    goldenPath.spec.parameters = goldenPath.spec.parameters.filter(step =>
      isGoldenPathAuthorized(parameterDecision, step),
    );
  } else if (
    goldenPath.spec.parameters &&
    !isGoldenPathAuthorized(parameterDecision, goldenPath.spec.parameters)
  ) {
    goldenPath.spec.parameters = undefined;
  }

  goldenPath.spec.steps = goldenPath.spec.steps.filter(step =>
    isGoldenPathAuthorized(stepDecision, step),
  );

  return goldenPath;
}
