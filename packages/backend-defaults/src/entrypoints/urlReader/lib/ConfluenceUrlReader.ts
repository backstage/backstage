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
  LoggerService,
  UrlReaderService,
  UrlReaderServiceReadTreeOptions,
  UrlReaderServiceReadTreeResponse,
  UrlReaderServiceReadUrlOptions,
  UrlReaderServiceReadUrlResponse,
  UrlReaderServiceSearchOptions,
  UrlReaderServiceSearchResponse,
} from '@backstage/backend-plugin-api';
import {
  FromReadableArrayOptions,
  ReaderFactory,
  ReadTreeResponseFactory,
} from './types';
import {
  Attachment,
  ChildPage,
  ConfluenceIntegrationConfig,
  readConfluenceIntegrationConfigs,
} from '@backstage/integration';
import { Readable } from 'stream';
import { InputError, NotFoundError, NotModifiedError } from '@backstage/errors';
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
    throw new Error('This method will be implemented in the future'); //+
  }

  parseUrl(url: string): {
    spacekey: string;
    title: string;
    titleWithSpaces: string;
  } {
    let spacekey: string | undefined = undefined;
    let title: string | undefined = undefined;
    let titleWithSpaces: string | undefined = '';
    const params = new URL(url);
    if (params.pathname.split('/')[1] === 'display') {
      // https://confluence.example.com/display/SPACEKEY/Page+Title
      spacekey = params.pathname.split('/')[2];
      title = params.pathname.split('/')[3];
      titleWithSpaces = title?.replace(/\+/g, ' ');
      return { spacekey, title, titleWithSpaces };
    } else if (params.pathname.split('/')[2] === 'display') {
      // https://confluence.example.com/prefix/display/SPACEKEY/Page+Title
      spacekey = params.pathname.split('/')[3];
      title = params.pathname.split('/')[4];
      titleWithSpaces = title?.replace(/\+/g, ' ');
      return { spacekey, title, titleWithSpaces };
    } else if (params.pathname.split('/')[2] === 'spaces') {
      // https://example.atlassian.net/wiki/spaces/SPACEKEY/pages/1234567/Page+Title
      spacekey = params.pathname.split('/')[3];
      title = params.pathname.split('/')[6];
      titleWithSpaces = title?.replace(/\+/g, ' ');
      return { spacekey, title, titleWithSpaces };
    }
    throw new InputError(
      'The Url format for Confluence is incorrect. Acceptable format is `<CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE>` or `<CONFLUENCE_BASE_URL>/spaces/<SPACEKEY>/pages/<PAGEID>/<PAGE+TITLE>` for Confluence cloud',
    );
  }

  async readTree(
    url: string,
    _options?: UrlReaderServiceReadTreeOptions,
  ): Promise<UrlReaderServiceReadTreeResponse> {
    const { spacekey, title } = this.parseUrl(url);

    const pages = await this.loadConfluencePage(spacekey, title, '/docs');

    const index = this.generateIndexPage(pages); // Generate index page for fetched pages
    pages.push({ data: Readable.from(index), path: `docs/index.md` });

    return this.deps.treeResponseFactory.fromReadableArray(pages);
  }

  search(
    _url: string,
    _options?: UrlReaderServiceSearchOptions,
  ): Promise<UrlReaderServiceSearchResponse> {
    throw new Error('Confluence does not implement search');
  }

  async loadConfluencePage(
    spaceKey: string,
    pageTitle: string,
    path: string,
  ): Promise<FromReadableArrayOptions> {
    const docItems: FromReadableArrayOptions = [];

    // fetch page
    const { pageId, page, title } = await this.fetchConfluencePage(
      spaceKey,
      pageTitle,
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

    let pageMarkdown = this.replaceAttachmentLinks(attachments, page);
    pageMarkdown = this.replaceHyperLinks(pageMarkdown);
    docItems.push({
      data: Readable.from(pageMarkdown),
      path: `${path}/${title}.md`,
    });

    // fetch child pages and repeat
    const children = await this.fetchChildPages(pageId);
    for (const childPage of children) {
      const childPageContent = await this.loadConfluencePage(
        spaceKey,
        childPage.title,
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
      // If .pdf, this regex matches Markdown links in the format [link text](url)
      // If not ![alt text](url)
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

  private replaceHyperLinks(page: string) {
    // # Regex pattern to match and remove the word between # and -
    const pattern = /\[([^\]]+)\]\(#.*?-(.*?)(\))/gi;

    // # Replace with the new format
    const result = page.replaceAll(pattern, (_, match) => {
      const sanitizedMatch = match
        .replaceAll(/ /g, '-') // remove spaces replace with -
        .replaceAll(/[\+.\/:]/g, '') // remove special characters
        .toLocaleLowerCase();
      return `[${match}](#${sanitizedMatch})`;
    });

    return result;
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

  private htmlToMarkDown(html: string) {
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

  async fetchConfluencePage(
    spaceKey: string,
    pageTitle: string,
  ): Promise<{
    pageId: string;
    page: string;
    title: string;
  }> {
    const { host, apiToken } = this.config;
    const url = `https://${host}/wiki/rest/api/content?spaceKey=${spaceKey}&title=${pageTitle}&expand=body.export_view`;
    const init = { headers: { Authorization: apiToken } };

    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();

    if (apiResponse.size === 0) throw new NotFoundError('Page not found');
    const page = apiResponse.results[0];

    const pageId = page.id;
    const pageHtml = page.body.export_view.value;
    const title = page.title;
    return {
      pageId,
      title,
      page: this.htmlToMarkDown(pageHtml),
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
