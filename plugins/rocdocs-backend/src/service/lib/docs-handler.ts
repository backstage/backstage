/*
 * Copyright 2020 Spotify AB
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
import { Entity } from '@backstage/catalog-model';
import { parseReferenceAnnotation } from '../../helpers';
import YAML from 'yaml';

export class DocsHandler {
  private entity: Entity;
  private reader: UrlReader;

  constructor({ entity, reader }: { entity: Entity; reader: UrlReader }) {
    this.entity = entity;
    this.reader = reader;
  }

  async getDocsResponse(path: string) {
    const { type, target } = parseReferenceAnnotation(
      'backstage.io/rocdocs-ref',
      this.entity,
    );

    if (type !== 'url') {
      throw new Error(
        `Invalid rocdocs-ref with type ${type}. Only 'url' type is supported.`,
      );
    }

    console.log(path);

    const menuContent = await this.getMenuContent(target);
    const pageContent = await this.getPageContent(target, path);

    return {
      menu: menuContent,
      page: pageContent,
    };
  }

  private async getMenuContent(target: string) {
    const navResponse = await this.reader.read(target);

    return YAML.parse(await navResponse.toString());
  }

  private async getPageContent(target: string, path?: string) {
    const currentDocsPage = path ? path : 'index.md';

    const url = new URL(currentDocsPage, target).toString();

    console.log(currentDocsPage, path, target, url);

    const response = await this.reader.read(url);

    return response.toString();
  }
}
