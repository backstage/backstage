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
import { OverflowTooltip } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Typography } from '@material-ui/core';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';
import {
  getRegionsText,
  getNumberOfTemplatesText,
} from '@backstage/plugin-golden-paths-react';

import { FlexContainer } from '../GoldenPathCard.styles';
import {
  Container,
  RegionsContainer,
  StyledRegionsIcon,
  StyledTemplatesIcon,
} from './RegionsAndTemplates.styles';

export const RegionsAndTemplates = () => {
  const { entity } = useEntity<GoldenPathEntityV1beta1>();

  if (!entity) return null;

  const regions = getRegionsText(entity);

  return (
    <FlexContainer data-testid="golden-path-regions-and-templates">
      <RegionsContainer>
        {regions && (
          <>
            <StyledRegionsIcon />
            <OverflowTooltip text={regions} />
          </>
        )}
      </RegionsContainer>

      <Container>
        <StyledTemplatesIcon />
        <Typography>{getNumberOfTemplatesText(entity)}</Typography>
      </Container>
    </FlexContainer>
  );
};
