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
import { useEntity } from '@backstage/plugin-catalog-react';
import { Content, Header, Page } from '@backstage/core-components';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';
import { GoldenPathContextMenu } from '@backstage/plugin-golden-paths-react';

import { GoldenPathTitle } from './GoldenPathTitle';
import { DetailsContent } from '@backstage/plugin-golden-paths-react';

export const GoldenPathDetails = () => {
  const { entity } = useEntity<GoldenPathEntityV1beta1>();

  const {
    kind,
    metadata: { title },
    spec: { type },
  } = entity;

  return (
    <Page themeId="golden-path-details">
      <Header
        title={<GoldenPathTitle entity={entity} />}
        type={`${kind} — ${type}`}
        pageTitleOverride={title}
      >
        <GoldenPathContextMenu
          taskConfigUrl={
            entity.metadata?.annotations?.['backstage.io/managed-by-location']
          }
        />
      </Header>
      <Content>
        <DetailsContent />
      </Content>
    </Page>
  );
};
