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

import { createDevApp } from '@backstage/dev-utils';
import { NotFoundError } from '@backstage/errors';
import React from 'react';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TechDocsReaderPageContent,
  SyncResult,
  TechDocsStorageApi,
  techdocsStorageApiRef,
} from '../src';

import { configApiRef, discoveryApiRef } from '@backstage/core-plugin-api';
import { TechDocsReaderPageProvider } from '@backstage/plugin-techdocs-react';
import { Header, Page, TabbedLayout } from '@backstage/core-components';

// used so each route can provide it's own implementation in the constructor of the react component
let apiHolder: TechDocsStorageApi | undefined = undefined;

const apiBridge: TechDocsStorageApi = {
  getApiOrigin: async () => '',
  getBaseUrl: (...args) => apiHolder!.getBaseUrl(...args),
  getBuilder: () => apiHolder!.getBuilder(),
  getStorageUrl: () => apiHolder!.getStorageUrl(),
  getEntityDocs: (...args) => apiHolder!.getEntityDocs(...args),
  syncEntityDocs: (...args) => apiHolder!.syncEntityDocs(...args),
};

const mockContent = `
<h1>Hello World!</h1>
<p>This is an example content that will actually be provided by a MkDocs powered site</p>
`;

function createPage({
  entityDocs,
  syncDocs,
  syncDocsDelay,
}: {
  entityDocs?: (props: {
    called: number;
    content: string;
  }) => string | Promise<string>;
  syncDocs: () => SyncResult;
  syncDocsDelay?: number;
}) {
  class Api implements TechDocsStorageApi {
    private entityDocsCallCount: number = 0;

    getApiOrigin = async () => '';
    getBaseUrl = async () => '';
    getBuilder = async () => 'local';
    getStorageUrl = async () => '';

    async getEntityDocs() {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!entityDocs) {
        return mockContent;
      }

      return entityDocs({
        called: this.entityDocsCallCount++,
        content: mockContent,
      });
    }

    async syncEntityDocs(
      _: CompoundEntityRef,
      logHandler?: (line: string) => void,
    ) {
      if (syncDocsDelay) {
        for (let i = 0; i < 10; i++) {
          setTimeout(
            () => logHandler?.call(this, `Log line ${i}`),
            ((i + 1) * syncDocsDelay) / 10,
          );
        }

        await new Promise(resolve => {
          setTimeout(resolve, syncDocsDelay);
        });
      }

      return syncDocs();
    }
  }

  class Component extends React.Component {
    constructor(props: {}) {
      super(props);

      apiHolder = new Api();
    }

    render() {
      return (
        <TechDocsReaderPageProvider
          entityRef={{
            kind: 'Component',
            namespace: 'default',
            name: 'my-docs',
          }}
        >
          <TechDocsReaderPageContent />
        </TechDocsReaderPageProvider>
      );
    }
  }

  return <Component />;
}

createDevApp()
  .registerApi({
    api: techdocsStorageApiRef,
    deps: {
      configApi: configApiRef,
      discoveryApi: discoveryApiRef,
    },
    factory: () => apiBridge,
  })

  .addPage({
    title: 'TechDocs',
    element: (
      <Page themeId="home">
        <Header title="TechDocs" />
        <TabbedLayout>
          <TabbedLayout.Route path="/fresh" title="Fresh">
            {createPage({
              syncDocs: () => 'cached',
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/stale" title="Stale">
            {createPage({
              entityDocs: ({ called, content }) => {
                return called === 0
                  ? content
                  : content.replace(/World/, 'New World');
              },
              syncDocs: () => 'updated',
              syncDocsDelay: 2000,
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/initial" title="Initial Build">
            {createPage({
              entityDocs: ({ called, content }) => {
                if (called < 1) {
                  throw new NotFoundError();
                }

                return content;
              },
              syncDocs: () => 'updated',
              syncDocsDelay: 10000,
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/not-found" title="Not Found">
            {createPage({
              entityDocs: () => {
                throw new NotFoundError('Not found, some error message...');
              },
              syncDocs: () => 'cached',
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/error" title="Error">
            {createPage({
              entityDocs: () => {
                throw new Error('Another more critical error');
              },
              syncDocs: () => 'cached',
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/serror" title="Sync Error">
            {createPage({
              syncDocs: () => {
                throw new Error('Some random error');
              },
              syncDocsDelay: 2000,
            })}
          </TabbedLayout.Route>

          <TabbedLayout.Route path="/berror" title="Both Error">
            {createPage({
              entityDocs: () => {
                throw new Error('Some random error');
              },
              syncDocs: () => {
                throw new Error('Some random error');
              },
              syncDocsDelay: 2000,
            })}
          </TabbedLayout.Route>
        </TabbedLayout>
      </Page>
    ),
  })
  .render();
