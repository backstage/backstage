/*
 * Copyright 2024 The Backstage Authors
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
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import { ReaderFactory, ReadTreeResponseFactory } from './types';
import {
  ConfluenceIntegrationConfig,
  generateIndexPage,
  loadConfluencePage,
  readConfluenceIntegrationConfigs,
} from '@backstage/integration';
import { Readable } from 'stream';

export class ConfluenceUrlReader implements UrlReaderService {
  static factory: ReaderFactory = ({ config, treeResponseFactory }) => {
    return readConfluenceIntegrationConfigs(config).map(integration => {
      const reader = new ConfluenceUrlReader(integration, {
        treeResponseFactory,
      });
      const predicate = (url: URL) => url.host === integration.host;
      return { reader, predicate };
    });
  };

  constructor(
    private readonly config: ConfluenceIntegrationConfig,
    private readonly deps: {
      treeResponseFactory: ReadTreeResponseFactory;
    },
  ) {}

  async readUrl(
    _url: string,
    _options?: UrlReaderServiceReadUrlOptions,
  ): Promise<UrlReaderServiceReadUrlResponse> {
    throw new Error('Method not implemented.');
  }

  parseUrl(url: string) {
    const regex =
      /https:\/\/((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6})\/wiki\/spaces\/([A-Za-z0-9_-]+)\/pages\/(\d+)\/([A-Za-z0-9-_+]+)/;
    const [_string, host, space, pageId, title] = url.match(regex)!;
    const pageTitle = title.replaceAll('+', ' ');
    return {
      host,
      space,
      pageId,
      title: pageTitle,
    };
  }

  async readTree(
    url: string,
    _options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { pageId } = this.parseUrl(url);
    const pages = await loadConfluencePage(pageId, this.config, '/docs');

    const index = generateIndexPage(pages); // Generate index page from fetched pages
    pages.push({ data: Readable.from(index), path: `docs/index.md` });

    return this.deps.treeResponseFactory.fromReadableArray(pages);
  }

  search(
    _url: string,
    _options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('Method not implemented.');
  }
}
