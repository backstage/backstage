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
  EntityDisplayName,
  FavoriteEntity,
} from '@backstage/plugin-catalog-react';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';

import { TitleContainer, TextContainer } from './GoldenPathTitle.styles';

type Props = {
  entity: GoldenPathEntityV1beta1;
};

export const GoldenPathTitle = ({ entity }: Props) => {
  return (
    <TitleContainer>
      <TextContainer>
        <EntityDisplayName entityRef={entity} hideIcon />
      </TextContainer>
      <FavoriteEntity entity={entity} />
    </TitleContainer>
  );
};
