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
import { RootConfigService } from '@backstage/backend-plugin-api';
import {
  readConfluenceIntegrationConfigs,
  replaceAttachmentLinks,
  savePage,
} from '@backstage/integration';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import fetch, { RequestInit, Response } from 'node-fetch';
import { Config } from '@backstage/config';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import fs from 'fs';
import os from 'os';
// import { Attachment } from "@backstage/integration/src/confluence/types";

export class ConfluenceReader {
  static factory: (options: { config: RootConfigService }) => ConfluenceReader =
    ({ config }) => {
      return new ConfluenceReader(config);
    };

  constructor(private readonly config: Config) {}

  async readPage(pageId: string) {
    const page = await this.fetchConfluencePage(pageId);
    const attachments = await this.fetchPageAttachments(pageId);
    const markdownToPublish = replaceAttachmentLinks(attachments, page);
    savePage(markdownToPublish, pageId);
    return this.gettmpdirPath();
  }

  async fetchConfluencePage(pageId: string) {
    const { host, apiToken } = readConfluenceIntegrationConfigs(this.config)[0];
    const url = `https://${host}/wiki/api/v2/pages/${pageId}?body-format=EXPORT_VIEW`;
    const init = {
      headers: {
        Authorization: apiToken,
      },
    };
    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();
    const pageHtml = apiResponse.body.export_view.value;
    return this.htmlToMardDown(pageHtml);
  }

  private htmlToMardDown(html: string) {
    return NodeHtmlMarkdown.translate(html);
  }

  private gettmpdirPath() {
    const tmpdirPath = os.tmpdir();
    return tmpdirPath;
  }

  async fetchPageAttachments(pageId: string) {
    const attachments = await this.fetchConfluencePageAttachments(pageId);
    const path = `${this.gettmpdirPath()}/docs/attachments`;
    this.createDirectoryIfnotExists(path);
    for (const attachment of attachments) {
      await this.downloadAttachment(attachment, path);
    }
    return attachments;
  }

  async fetchConfluencePageAttachments(pageId: string) {
    const { host, apiToken } = readConfluenceIntegrationConfigs(this.config)[0];
    const url = `https://${host}/wiki/api/v2/pages/${pageId}/attachments`;
    const init = {
      headers: {
        Authorization: apiToken,
      },
    };
    const response = await this.fetchResponse(url, init);
    const apiResponse = await response.json();
    const attachments = apiResponse.results;
    return attachments;
  }

  private createDirectoryIfnotExists(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

  async downloadAttachment(attachment: any, dirPath: string) {
    const { host, apiToken } = readConfluenceIntegrationConfigs(this.config)[0];

    const attachmentTitle = attachment.title.replace(/ /g, '-');
    const path = `${dirPath}/${attachmentTitle}`;

    const url = `https://${host}/wiki/rest/api/content/${attachment.pageId}/child/attachment/${attachment.id}/download`;
    const res = await this.fetchResponse(url, {
      method: 'GET',
      headers: {
        Authorization: apiToken,
      },
    });
    const writeStream = fs.createWriteStream(path);

    await new Promise((resolve, reject) => {
      res.body?.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
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
