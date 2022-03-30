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
import fetch from 'cross-fetch';
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
  private readonly logger: Logger;
  public readonly type: string = 'stack-overflow';

  private constructor(options: StackOverflowQuestionsCollatorFactoryOptions) {
    this.baseUrl = options.baseUrl;
    this.requestParams = options.requestParams;
    this.logger = options.logger;
  }

  static fromConfig(
    config: Config,
    options: StackOverflowQuestionsCollatorFactoryOptions,
  ) {
    const baseUrl =
      config.getOptionalString('stackoverflow.baseUrl') ||
      'https://api.stackexchange.com/2.2';
    return new StackOverflowQuestionsCollatorFactory({ ...options, baseUrl });
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
    const params = qs.stringify(this.requestParams, {
      arrayFormat: 'comma',
      addQueryPrefix: true,
    });

    const res = await fetch(`${this.baseUrl}/questions${params}`);
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
  }
}
