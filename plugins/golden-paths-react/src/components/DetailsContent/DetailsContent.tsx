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
import { Content, LinkButton } from '@backstage/core-components';
import { InfoCard, OverflowTooltip } from '@backstage/core-components';
import { Chip } from '@material-ui/core';
import {
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';
import { isArray } from 'lodash';

import {
  Container,
  LeftContainer,
  RightContainer,
  StyledGridContainer,
  StyledRegionsIcon,
  StyledTemplatesIcon,
} from './DetailsContent.styles';
import { RefLinksContainer } from './DetailsContent.styles';
import { DetailsDescription } from './DetailsDescription';
import Carousel from './DetailsCards/Carousel';
import { StartButton } from '../StartButton';
import { getNumberOfTemplatesText, getRegionsText } from '../../utilities';

type Props = {
  isStartButtonDisplayed?: boolean;
};

export const DetailsContent = ({ isStartButtonDisplayed = true }: Props) => {
  const { entity } = useEntity<GoldenPathEntityV1beta1>();
  const owners = getEntityRelations(entity, RELATION_OWNED_BY);

  const {
    metadata: { tags },
    spec: { parameters, steps },
  } = entity;

  const regions = getRegionsText(entity);

  const StartButtonComponent = () =>
    !parameters || (isArray(parameters) && parameters.length === 0) ? (
      <StartButton />
    ) : (
      <LinkButton to="initial-params" variant="contained" color="primary">
        Choose Golden Path
      </LinkButton>
    );

  return (
    <>
      <InfoCard title="Details">
        <StyledGridContainer>
          <LeftContainer>
            {isStartButtonDisplayed ? <StartButtonComponent /> : null}

            <RefLinksContainer data-testid="golden-path-owners">
              <EntityRefLinks entityRefs={owners} />
            </RefLinksContainer>

            {regions && (
              <Container data-testid="golden-path-regions">
                <StyledRegionsIcon />
                <OverflowTooltip text={regions} />
              </Container>
            )}

            <Container data-testid="golden-path-template-number">
              <StyledTemplatesIcon />
              {getNumberOfTemplatesText(entity)}
            </Container>
          </LeftContainer>

          <RightContainer>
            <DetailsDescription />

            {tags && (
              <div data-testid="golden-path-content-tags">
                {tags.map((tag, index) => (
                  <Chip key={`tag-${index}`} size="small" label={tag} />
                ))}
              </div>
            )}
          </RightContainer>
        </StyledGridContainer>
      </InfoCard>

      <Content>
        <Carousel items={steps} />
      </Content>
    </>
  );
};
