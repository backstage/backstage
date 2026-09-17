/*
 * Copyright 2020 The Backstage Authors
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
  Entity,
  parseEntityRef,
} from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';

// todo: should this be a constant in a scaffolder package?
const SOURCE_TEMPLATE_ANNOTATION = 'backstage.io/source-template';

/**
 * Returns the compound entity ref of the source template that was used to
 * create this entity (assuming that it still exists and the user has access
 * to it).
 */
export const useSourceTemplateCompoundEntityRef = (entity: Entity) => {
  const catalogApi = useApi(catalogApiRef);
  const { value: sourceTemplateRef } = useAsync(async () => {
    const refCandidate =
      entity.metadata.annotations?.[SOURCE_TEMPLATE_ANNOTATION];
    let compoundRefCandidate: CompoundEntityRef | undefined;

    if (!refCandidate) {
      return undefined;
    }

    try {
      // Check for access and that this template still exists.
      const template = await catalogApi.getEntityByRef(refCandidate);
      compoundRefCandidate = parseEntityRef(refCandidate);

      return template !== undefined ? compoundRefCandidate : undefined;
    } catch {
      return undefined;
    }
  }, [catalogApi, entity]);

  return sourceTemplateRef;
};
