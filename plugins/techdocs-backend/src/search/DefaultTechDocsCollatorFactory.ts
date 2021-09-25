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

import { Config } from '@backstage/config';
import { DocumentCollatorFactory } from '@backstage/search-common';
import { Readable } from 'stream';
import {
  DefaultTechDocsCollator,
  TechDocsCollatorOptions,
} from './DefaultTechDocsCollator';

export class DefaultTechDocsCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'techdocs';

  private config: Config;
  private options: TechDocsCollatorOptions;

  private constructor(config: Config, options: TechDocsCollatorOptions) {
    this.config = config;
    this.options = options;
  }

  static fromConfig(config: Config, options: TechDocsCollatorOptions) {
    return new DefaultTechDocsCollatorFactory(config, options);
  }

  async getCollator(): Promise<Readable> {
    const collator = DefaultTechDocsCollator.fromConfig(
      this.config,
      this.options,
    );
    return Readable.from(collator.execute());
  }
}
