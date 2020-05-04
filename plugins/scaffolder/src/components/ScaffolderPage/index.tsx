/*
 * Copyright 2020 Spotify AB
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
import { Content, InfoCard, Header, Page, pageTheme } from '@backstage/core';

// TODO(blam): Connect to backend
const STATIC_DATA = [
  {
    id: 'react-ssr-template',
    name: 'SSR React Website',
    description:
      'Next.js application skeleton for creating isomorphic web applications.',
    ownerId: 'something',
  },
];
const ScaffolderPage: React.FC<{}> = () => {
  return (
    <Page theme={pageTheme.home}>
      <Header title="Create a new component" subtitle="All your stuff" />
      <Content>
        <div style={{ display: 'flex' }}>
          {STATIC_DATA.map((item) => {
            return (
              <InfoCard
                title={item.name}
                deepLink={{ title: 'Create', link: '#' }}
              >
                <p>{item.description}</p>
              </InfoCard>
            );
          })}
        </div>
      </Content>
    </Page>
  );
};

export default ScaffolderPage;
