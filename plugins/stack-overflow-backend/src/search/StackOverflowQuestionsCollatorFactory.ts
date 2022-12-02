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

import {
  IndexableDocument,
  DocumentCollatorFactory,
} from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import { Readable } from 'stream';
import fetch from 'node-fetch';
import qs from 'qs';
import { Logger } from 'winston';

/**
 * Extended IndexableDocument with stack overflow specific properties
 *
 * @public
 */
export interface StackOverflowDocument extends IndexableDocument {
  answers: number;
  tags: string[];
}

/**
 * Type representing the request parameters accepted by the {@link StackOverflowQuestionsCollatorFactory}
 *
 * @public
 */
export type StackOverflowQuestionsRequestParams = {
  [key: string]: string | string[] | number;
};

/**
 * Options for {@link StackOverflowQuestionsCollatorFactory}
 *
 * @public
 */
export type StackOverflowQuestionsCollatorFactoryOptions = {
  baseUrl?: string;
  maxPage?: number;
  apiKey?: string;
  apiAccessToken?: string;
  requestParams: StackOverflowQuestionsRequestParams;
  logger: Logger;
};

/**
 * Search collator responsible for collecting stack overflow questions to index.
 *
 * @public
 */
export class StackOverflowQuestionsCollatorFactory
  implements DocumentCollatorFactory
{
  protected requestParams: StackOverflowQuestionsRequestParams;
  private readonly baseUrl: string | undefined;
  private readonly apiKey: string | undefined;
  private readonly apiAccessToken: string | undefined;
  private readonly maxPage: number | undefined;
  private readonly logger: Logger;
  public readonly type: string = 'stack-overflow';

  private constructor(options: StackOverflowQuestionsCollatorFactoryOptions) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.apiAccessToken = options.apiAccessToken;
    this.maxPage = options.maxPage;
    this.requestParams = options.requestParams;
    this.logger = options.logger.child({ documentType: this.type });
  }

  static fromConfig(
    config: Config,
    options: StackOverflowQuestionsCollatorFactoryOptions,
  ) {
    const apiKey = config.getOptionalString('stackoverflow.apiKey');
    const apiAccessToken = config.getOptionalString(
      'stackoverflow.apiAccessToken',
    );
    const baseUrl =
      config.getOptionalString('stackoverflow.baseUrl') ||
      'https://api.stackexchange.com/2.2';
    const maxPage = options.maxPage || 100;
    return new StackOverflowQuestionsCollatorFactory({
      baseUrl,
      maxPage,
      apiKey,
      apiAccessToken,
      ...options,
    });
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<StackOverflowDocument> {
    if (!this.baseUrl) {
      this.logger.debug(
        `No stackoverflow.baseUrl configured in your app-config.yaml`,
      );
    }

    try {
      if (Object.keys(this.requestParams).indexOf('key') >= 0) {
        this.logger.warn(
          'The API Key should be passed as a seperate param to bypass encoding',
        );
        delete this.requestParams.key;
      }
    } catch (e) {
      this.logger.error(`Caught ${e}`);
    }

    const params = qs.stringify(this.requestParams, {
      arrayFormat: 'comma',
      addQueryPrefix: true,
    });

    const apiKeyParam = this.apiKey
      ? `${params ? '&' : '?'}key=${this.apiKey}`
      : '';

    let hasMorePages = true;
    let page = 1;
    while (hasMorePages) {
      if (page === this.maxPage) {
        this.logger.warn(
          `Over ${this.maxPage} requests to the Stack Overflow API have been made, which may not have been intended. Either specify requestParams that limit the questions returned, or configure a higher maxPage if necessary.`,
        );
        break;
      }
      const res = await fetch(
        `${this.baseUrl}/questions${params}${apiKeyParam}&page=${page}`,
        this.apiAccessToken
          ? {
              headers: {
                'X-API-Access-Token': this.apiAccessToken,
              },
            }
          : undefined,
      );

      const data = await res.json();
      for (const question of data.items) {
        yield {
          title: question.title,
          location: question.link,
          text: question.owner.display_name,
          tags: question.tags,
          answers: question.answer_count,
        };
      }
      hasMorePages = data.has_more;
      page = page + 1;
    }
  }
}
