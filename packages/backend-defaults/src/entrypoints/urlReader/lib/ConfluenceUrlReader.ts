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
  Attachment,
  ChildPage,
  ConfluenceIntegrationConfig,
  readConfluenceIntegrationConfigs,
} from '@backstage/integration';
import { Readable } from 'stream';
import { FromReadableArrayOptions } from '@backstage/backend-defaults';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import { NodeHtmlMarkdown } from 'node-html-markdown';

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
    const pages = await this.loadConfluencePage(pageId, '/docs');

    const index = this.generateIndexPage(pages); // Generate index page for fetched pages
    pages.push({ data: Readable.from(index), path: `docs/index.md` });

    return this.deps.treeResponseFactory.fromReadableArray(pages);
  }

  search(
    _url: string,
    _options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('Method not implemented.');
  }

  async loadConfluencePage(
    pageId: string,
    path: string,
  ): Promise<FromReadableArrayOptions> {
    const docItems: FromReadableArrayOptions = [];

    // fetch page
    const { page, title, lastModifiedAt } = await this.fetchConfluencePage(
      pageId,
    );

    // fetch its attachments
    const attachments: Attachment[] = await this.fetchConfluencePageAttachments(
      pageId,
    );
    for (const attachment of attachments) {
      const imageData: any = await this.fetchAttachment(attachment);
      docItems.push({
        data: Readable.fromWeb(imageData),
        path: `${path}/attachments/${attachment.title.replaceAll(' ', '-')}`,
        lastModifiedAt: new Date(attachment.version.createdAt),
      });
    }

    const pageMarkdown = this.replaceAttachmentLinks(attachments, page);
    docItems.push({
      data: Readable.from(pageMarkdown),
      path: `${path}/${title}.md`,
      lastModifiedAt: new Date(lastModifiedAt),
    });

    // fetch child pages and repeat
    const children = await this.fetchChildPages(pageId);
    for (const childPage of children) {
      const childPageContent = await this.loadConfluencePage(
        childPage.id,
        `${path}/${title.toLocaleLowerCase().replaceAll(' ', '-')}`,
      );
      docItems.push(...childPageContent);
    }

    return docItems;
  }

  private replaceAttachmentLinks(attachments: Attachment[], markdown: string) {
    let markdownToPublish = markdown;
    for (const attachment of attachments) {
      const attachmentTitle = attachment.title.replace(/ /g, '-');
      const attachmentTitleInUrl = attachment.title.replace(/ /g, '%20');
      const regex = attachmentTitleInUrl.includes('.pdf')
        ? new RegExp(`(\\[.*?\\]\\()(.*?${attachmentTitleInUrl}.*?)(\\))`, 'gi')
        : new RegExp(
            `(\\!\\[.*?\\]\\()(.*?${attachmentTitleInUrl}.*?)(\\))`,
            'gi',
          );
      markdownToPublish = markdownToPublish.replace(
        regex,
        `$1./attachments/${attachmentTitle}$3`,
      );
    }
    return markdownToPublish;
  }

  private async fetchChildPages(pageId: string): Promise<ChildPage[]> {
    const { host, apiToken } = this.config;

    const url = `https://${host}/wiki/api/v2/pages/${pageId}/children`;
    const init = { headers: { Authorization: apiToken } };

    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();

    const childPages: ChildPage[] = apiResponse.results;
    return childPages;
  }

  private htmlToMardDown(html: string) {
    return NodeHtmlMarkdown.translate(html);
  }

  private async fetchAttachment(
    attachment: Attachment,
  ): Promise<ReadableStream> {
    const { host, apiToken } = this.config;

    const url = `https://${host}/wiki/rest/api/content/${attachment.pageId}/child/attachment/${attachment.id}/download`;
    const init = { headers: { Authorization: apiToken } };

    const response = await this.fetchResponse(url, init);
    return response.body!;
  }

  async fetchConfluencePage(pageId: string) {
    const { host, apiToken } = this.config;
    const url = `https://${host}/wiki/api/v2/pages/${pageId}?body-format=EXPORT_VIEW`;
    const init = { headers: { Authorization: apiToken } };

    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();

    const pageHtml = apiResponse.body.export_view.value;
    const title = apiResponse.title;
    const lastModifiedAt = apiResponse.version.createdAt;
    return {
      page: this.htmlToMardDown(pageHtml),
      title,
      lastModifiedAt,
    };
  }

  async fetchConfluencePageAttachments(pageId: string) {
    const { host, apiToken } = this.config;
    const url = `https://${host}/wiki/api/v2/pages/${pageId}/attachments`;
    const init = { headers: { Authorization: apiToken } };

    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();

    const attachments = apiResponse.results;
    return attachments;
  }

  generateIndexPage(pages: FromReadableArrayOptions) {
    let markdownContent = '# Index of Pages\n\n';

    pages.forEach(page => {
      const parts = page.path.split('/');
      let fileName = parts.pop() || '';
      if (fileName.endsWith('.md')) {
        fileName = fileName.replace('.md', '');
        const path = page.path.replace('/docs/', '').replace('.md', '');
        const depth = parts.length - 2;
        const indentation = '  '.repeat(depth);
        markdownContent += `${indentation}- [${fileName}](./${path})\n`;
      }
    });

    return markdownContent;
  }

  private async fetchResponse(
    url: string | URL,
    init: RequestInit,
  ): Promise<Response> {
    const urlAsString = url.toString();
    const response = await fetch(urlAsString, {
      method: 'GET',
      ...init,
    });

    if (!response.ok) {
      const message = `Request failed for ${urlAsString}, ${response.status} ${response.statusText}`;

      if (response.status === 304) throw new NotModifiedError();
      if (response.status === 404) throw new NotFoundError(message);
      throw new Error(message);
    }

    return response;
  }
}
