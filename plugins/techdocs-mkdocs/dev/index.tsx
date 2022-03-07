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

import { createDevApp } from '@backstage/dev-utils';
import { Header, Page, Content } from '@backstage/core-components';
import {
  SyncResult,
  TechDocsStorageApi,
  techdocsStorageApiRef,
  TechDocsReaderProvider,
} from '@backstage/plugin-techdocs';

import { techdocsMkdocsPlugin } from '../src/plugin';
import { MkDocsContent } from '../src/components';

class TechDocsStorageApiImpl implements TechDocsStorageApi {
  getApiOrigin = async () => '';
  getBaseUrl = async () => '';
  getStorageUrl = async () => '';
  getBuilder = async () => 'local';
  syncEntityDocs = async () => 'updated' as SyncResult;
  async getEntityDocs() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return `
      <h1>Hello World!</h1>
      <p>This is an example content that will actually be provided by a MkDocs powered site</p>
    `;
  }
}

const entityRef = {
  kind: 'component',
  namespace: 'default',
  name: 'local',
};

createDevApp()
  .registerPlugin(techdocsMkdocsPlugin)
  .registerApi({
    api: techdocsStorageApiRef,
    deps: {},
    factory: () => new TechDocsStorageApiImpl(),
  })
  .addPage({
    title: 'TechDocs MkDocs',
    element: (
      <Page themeId="home">
        <Header title="TechDocs MkDocs" />
        <Content>
          <TechDocsReaderProvider entityRef={entityRef}>
            <MkDocsContent />
          </TechDocsReaderProvider>
        </Content>
      </Page>
    ),
  })
  .render();
