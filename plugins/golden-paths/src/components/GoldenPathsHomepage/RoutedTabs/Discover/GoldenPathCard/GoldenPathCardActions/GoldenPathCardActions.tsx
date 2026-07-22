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
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { LinkButton } from '@backstage/core-components';
import {
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';

import {
  RefLinksContainer,
  StyledCardActions,
} from './GoldenPathCardActons.styles';

export const GoldenPathCardActions = () => {
  const { entity } = useEntity<GoldenPathEntityV1beta1>();
  const owners = getEntityRelations(entity, RELATION_OWNED_BY);

  if (!owners.length || !entity.metadata.namespace) return null;

  const {
    metadata: { namespace, name },
  } = entity;

  return (
    <StyledCardActions>
      <RefLinksContainer>
        <EntityRefLinks entityRefs={owners} />
      </RefLinksContainer>

      <LinkButton
        to={`${namespace}/${name}`}
        color="primary"
        variant="outlined"
      >
        Choose
      </LinkButton>
    </StyledCardActions>
  );
};
