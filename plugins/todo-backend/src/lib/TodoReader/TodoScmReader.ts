/*
 * Copyright 2021 Spotify AB
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

import { extname } from 'path';
import { UrlReader } from '@backstage/backend-common';
import { ScmIntegrations } from '@backstage/integration';
import { Logger } from 'winston';
import { parse } from 'leasot';
import {
  ReadTodosOptions,
  ReadTodosResult,
  TodoItem,
  TodoReader,
} from './types';
import { Config } from '@backstage/config';

type TodoParser = (ctx: {
  content: string;
  path: string;
}) => { text: string; author?: string; lineNumber: number }[];

type Options = {
  logger: Logger;
  reader: UrlReader;
  parser?: TodoParser;
};

type CacheItem = {
  etag: string;
  result: ReadTodosResult;
};

const defaultTodoParser: TodoParser = ({ content, path }) => {
  try {
    const comments = parse(content, {
      extension: extname(path),
    });

    return comments.map(comment => ({
      text: comment.text,
      author: comment.ref,
      lineNumber: comment.line,
    }));
  } catch /* ignore unsupported extensions */ {
    return [];
  }
};

export class TodoScmReader implements TodoReader {
  private readonly logger: Logger;
  private readonly reader: UrlReader;
  private readonly parser: TodoParser;
  private readonly integrations: ScmIntegrations;

  private readonly cache = new Map<string, CacheItem>();

  static fromConfig(config: Config, options: Options) {
    return new TodoScmReader(options, ScmIntegrations.fromConfig(config));
  }

  private constructor(options: Options, integrations: ScmIntegrations) {
    this.logger = options.logger;
    this.reader = options.reader;
    this.parser = options.parser ?? defaultTodoParser;
    this.integrations = integrations;
  }

  async readTodos({ url }: ReadTodosOptions): Promise<ReadTodosResult> {
    const cacheItem = this.cache.get(url);
    try {
      const newCacheItem = await this.doReadTodos({ url }, cacheItem?.etag);
      this.cache.set(url, newCacheItem);
      return newCacheItem.result;
    } catch (error) {
      if (cacheItem && error.name === 'NotModifiedError') {
        return cacheItem.result;
      }
      throw error;
    }
  }

  private async doReadTodos(
    { url }: ReadTodosOptions,
    etag?: string,
  ): Promise<CacheItem> {
    const tree = await this.reader.readTree(url, {
      etag,
      filter(path) {
        return !path.startsWith('.') && !path.includes('/.');
      },
    });

    const files = await tree.files();
    this.logger.info(`Read ${files.length} files from ${url}`);

    const todos = new Array<TodoItem>();
    for (const file of files) {
      const content = await file.content();
      try {
        const items = this.parser({
          path: file.path,
          content: content.toString('utf8'),
        });
        const viewUrl = this.integrations.resolveUrl({
          url: file.path,
          base: url,
        });

        todos.push(
          ...items.map(({ lineNumber, text, author }) => ({
            text,
            author,
            lineNumber,
            repoFilePath: file.path,
            viewUrl:
              lineNumber === undefined ? viewUrl : `${viewUrl}#L${lineNumber}`,
          })),
        );
      } catch (error) {
        this.logger.error(`Failed to parse TODO in ${url}, ${error}`);
      }
    }

    return { result: { items: todos }, etag: tree.etag };
  }
}
