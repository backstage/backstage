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
import React from 'react';
import { createDevApp, DevAppPageOptions } from '@backstage/dev-utils';
import { Entity } from '@backstage/catalog-model';
import { Content, Header, HeaderLabel, Page } from '@backstage/core-components';
import { catalogApiRef, EntityProvider } from '@backstage/plugin-catalog-react';

import {
  scoreCardPlugin,
  ScoreBoardPage,
  EntityScoreCardContent,
} from '../src/plugin';

import {
  entityAtpService,
  entityGuestUser,
  entityIdentity,
  entityNonExistent,
  entityOnline,
  entityTeamOnline,
} from './sample-entities';
import { CatalogEntityPage } from '@backstage/plugin-catalog';

const entityContentPage = (
  entity: Entity,
  title: string,
  path: string,
): DevAppPageOptions => {
  return {
    element: (
      <EntityProvider entity={entity}>
        <Page themeId={entity?.spec?.type?.toString() ?? 'home'}>
          <Header
            title={entity?.metadata.name ?? 'Sample Dependencies Data'}
            subtitle="This is a dummy entity for testing various data"
          >
            <HeaderLabel label="Mode" value="Development" />
          </Header>
          <Content>
            {entity.kind === 'System' ? <EntityScoreCardContent /> : <></>}
          </Content>
        </Page>
      </EntityProvider>
    ),
    title,
    path,
  };
};

localStorage.setItem('sidebarPinState', 'true');

const mockEntities = [
  entityOnline,
  entityAtpService,
  entityIdentity,
  entityTeamOnline,
  entityGuestUser,
] as unknown as Entity[];

createDevApp()
  .registerPlugin(scoreCardPlugin)
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      ({
        async getEntities() {
          // TODO test await new Promise(r => setTimeout(r, 1000));
          return {
            items: mockEntities.slice(),
          };
        },
        async getEntityByName(name: string) {
          return mockEntities.find(e => e.metadata.name === name);
        },
      } as unknown as typeof catalogApiRef.T),
  })
  .addPage(
    entityContentPage(
      entityAtpService,
      'our-great-system',
      'score-card/our-great-system/score',
    ),
  )
  .addPage(entityContentPage(entityNonExistent, 'Not Found test', 'notFound'))
  .addPage({
    path: '/catalog/:kind/:namespace/:name',
    element: <CatalogEntityPage />,
  })
  .addPage({
    element: <ScoreBoardPage />,
    title: 'Score Board',
    path: '/score-card',
  })
  .render();
