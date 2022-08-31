/*
 * Copyright 2021 The Backstage Authors
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

import fetch from 'cross-fetch';
import qs from 'qs';
import { StackOverflowApi } from './StackOverflowApi';
import {
  StackOverflowQuestion,
  StackOverflowQuestionsRequestParams,
} from '../types';
import { Config } from '@backstage/config';

export class StackOverflowClient implements StackOverflowApi {
  private baseUrl: string;

  private constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
  }

  static fromConfig(config: Config) {
    return new StackOverflowClient({
      baseUrl:
        config.getOptionalString('stackoverflow.baseUrl') ||
        'https://api.stackexchange.com/2.2',
    });
  }

  /**
   * List Questions in the StackOverflow instance
   *
   * */
  async listQuestions(options: {
    requestParams: StackOverflowQuestionsRequestParams;
  }): Promise<StackOverflowQuestion[]> {
    const params = qs.stringify(options.requestParams, {
      addQueryPrefix: true,
    });
    const response = await fetch(`${this.baseUrl}/questions${params}`);
    const data = await response.json();
    return data.items;
  }
}
