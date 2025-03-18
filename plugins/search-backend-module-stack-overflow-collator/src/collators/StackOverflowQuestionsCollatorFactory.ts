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
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import { Readable } from 'stream';

import qs from 'qs';
import { LoggerService } from '@backstage/backend-plugin-api';

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
  teamName?: string;
  requestParams?: StackOverflowQuestionsRequestParams;
  logger: LoggerService;
};

const DEFAULT_BASE_URL = 'https://api.stackexchange.com/2.3';
const DEFAULT_MAX_PAGE = 100;
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
  private readonly teamName: string | undefined;
  private readonly maxPage: number | undefined;
  private readonly logger: LoggerService;
  public readonly type: string = 'stack-overflow';

  private constructor(options: StackOverflowQuestionsCollatorFactoryOptions) {
    this.baseUrl = options.baseUrl;
    this.apiKey = options.apiKey;
    this.apiAccessToken = options.apiAccessToken;
    this.teamName = options.teamName;
    this.maxPage = options.maxPage;
    this.logger = options.logger.child({ documentType: this.type });

    // Sets the same default request parameters as the official API documentation
    // See https://api.stackexchange.com/docs/questions
    this.requestParams = {
      order: 'desc',
      sort: 'activity',
      ...(options.requestParams ?? {}),
    };

    if (!options.requestParams?.site && this.baseUrl === DEFAULT_BASE_URL) {
      this.requestParams.site = 'stackoverflow';
    }
  }

  static fromConfig(
    config: Config,
    options: StackOverflowQuestionsCollatorFactoryOptions,
  ) {
    const apiKey = config.getOptionalString('stackoverflow.apiKey');
    const apiAccessToken = config.getOptionalString(
      'stackoverflow.apiAccessToken',
    );
    const teamName = config.getOptionalString('stackoverflow.teamName');
    const baseUrl =
      config.getOptionalString('stackoverflow.baseUrl') || DEFAULT_BASE_URL;
    const maxPage = options.maxPage || DEFAULT_MAX_PAGE;
    const requestParams = config
      .getOptionalConfig('stackoverflow.requestParams')
      ?.get<StackOverflowQuestionsRequestParams>();

    return new StackOverflowQuestionsCollatorFactory({
      baseUrl,
      maxPage,
      apiKey,
      apiAccessToken,
      teamName,
      requestParams,
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

    if (this.apiKey && this.teamName) {
      this.logger.debug(
        'Both stackoverflow.apiKey and stackoverflow.teamName configured in your app-config.yaml, apiKey must be removed before teamName will be used',
      );
    }

    try {
      if (Object.keys(this.requestParams).indexOf('key') >= 0) {
        this.logger.warn(
          'The API Key should be passed as a separate param to bypass encoding',
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

    const teamParam = this.teamName
      ? `${params ? '&' : '?'}team=${this.teamName}`
      : '';

    // PAT change requires team name as a parameter
    const requestUrl = this.apiKey
      ? `${this.baseUrl}/questions${params}${apiKeyParam}`
      : `${this.baseUrl}/questions${params}${teamParam}`;

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
        `${requestUrl}&page=${page}`,
        this.apiAccessToken
          ? {
              headers: {
                'X-API-Access-Token': this.apiAccessToken,
              },
            }
          : undefined,
      );

      const data = await res.json();
      for (const question of data.items ?? []) {
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
