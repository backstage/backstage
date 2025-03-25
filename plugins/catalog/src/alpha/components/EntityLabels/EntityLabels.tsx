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

import React from 'react';
import { HeaderLabel } from '@backstage/core-components';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../translation';

type EntityLabelsProps = {
  entity: Entity;
};

export function EntityLabels(props: EntityLabelsProps) {
  const { entity } = props;
  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  const { t } = useTranslationRef(catalogTranslationRef);
  return (
    <>
      {ownedByRelations.length > 0 && (
        <HeaderLabel
          label={t('entityLabels.ownerLabel')}
          contentTypograpyRootComponent="p"
          value={
            <EntityRefLinks
              entityRefs={ownedByRelations}
              defaultKind="Group"
              color="inherit"
            />
          }
        />
      )}
      {entity.spec?.lifecycle && (
        <HeaderLabel
          label={t('entityLabels.lifecycleLabel')}
          value={entity.spec.lifecycle?.toString()}
        />
      )}
    </>
  );
}
