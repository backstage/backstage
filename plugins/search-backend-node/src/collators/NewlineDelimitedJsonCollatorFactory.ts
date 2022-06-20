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

import { UrlReader } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { parse as parseNdjson } from 'ndjson';
import { Readable } from 'stream';
import { Logger } from 'winston';

/**
 * Options for instansiate NewlineDelimitedJsonCollatorFactory
 * @public
 */
export type NewlineDelimitedJsonCollatorFactoryOptions = {
  type: string;
  searchPattern: string;
  reader: UrlReader;
  logger: Logger;
  visibilityPermission?: Permission;
};

/**
 * Factory class producing a collator that can be used to index documents
 * sourced from the latest newline delimited JSON file matching a given search
 * pattern. "Latest" is determined by the name of the file (last alphabetically
 * is considered latest).
 *
 * @remarks
 * The reader provided must implement the `search()` method as well as the
 * `readUrl` method whose response includes the `stream()` method. Naturally,
 * the reader must also be configured to understand the given search pattern.
 *
 * @example
 * Here's an example configuration using Google Cloud Storage, which would
 * return the latest file under the `bucket` GCS bucket with files like
 * `xyz-2021.ndjson` or `xyz-2022.ndjson`.
 * ```ts
 * indexBuilder.addCollator({
 *   schedule,
 *   factory: NewlineDelimitedJsonCollatorFactory.fromConfig(env.config, {
 *     type: 'techdocs',
 *     searchPattern: 'https://storage.cloud.google.com/bucket/xyz-*',
 *     reader: env.reader,
 *     logger: env.logger,
 *   })
 * });
 * ```
 *
 * @public
 */
export class NewlineDelimitedJsonCollatorFactory
  implements DocumentCollatorFactory
{
  readonly type: string;

  public readonly visibilityPermission: Permission | undefined;

  private constructor(
    type: string,
    private readonly searchPattern: string,
    private readonly reader: UrlReader,
    private readonly logger: Logger,
    visibilityPermission: Permission | undefined,
  ) {
    this.type = type;
    this.visibilityPermission = visibilityPermission;
  }

  /**
   * Returns a NewlineDelimitedJsonCollatorFactory instance from configuration
   * and a set of options.
   */
  static fromConfig(
    _config: Config,
    options: NewlineDelimitedJsonCollatorFactoryOptions,
  ): NewlineDelimitedJsonCollatorFactory {
    return new NewlineDelimitedJsonCollatorFactory(
      options.type,
      options.searchPattern,
      options.reader,
      options.logger,
      options.visibilityPermission,
    );
  }

  /**
   * Returns the "latest" URL for the given search pattern (e.g. the one at the
   * end of the list, sorted alphabetically).
   */
  private async lastUrl(): Promise<string | undefined> {
    try {
      // Search for files matching the given pattern, then sort/reverse. The
      // first item in the list will be the "latest" file.
      this.logger.info(
        `Attempting to find latest .ndjson matching ${this.searchPattern}`,
      );
      const { files } = await this.reader.search(this.searchPattern);
      const candidates = files
        .filter(file => file.url.endsWith('.ndjson'))
        .sort((a, b) => a.url.localeCompare(b.url))
        .reverse();

      return candidates[0]?.url;
    } catch (e) {
      this.logger.error(`Could not search for ${this.searchPattern}`, e);
      throw e;
    }
  }

  async getCollator(): Promise<Readable> {
    // Search for files matching the given pattern.
    const lastUrl = await this.lastUrl();

    // Abort if no such file could be found.
    if (!lastUrl) {
      const noMatchingFile = `Could not find an .ndjson file matching ${this.searchPattern}`;
      this.logger.error(noMatchingFile);
      throw new Error(noMatchingFile);
    } else {
      this.logger.info(`Using latest .ndjson file ${lastUrl}`);
    }

    // Use the UrlReader to try and stream the file.
    const readerResponse = await this.reader.readUrl!(lastUrl);
    const stream = readerResponse.stream!();

    // Use ndjson's parser to turn the raw file into an object-mode stream.
    return stream.pipe(parseNdjson());
  }
}
