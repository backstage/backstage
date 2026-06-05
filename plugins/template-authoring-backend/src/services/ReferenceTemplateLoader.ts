/*
 * Copyright 2026 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { InputError, NotFoundError } from '@backstage/errors';

/**
 * Resolves entity references to Template entities, ready to be fed to the
 * LLM as in-context examples. Rejects refs that exist but are not actually
 * `kind: Template` entities — the generator should not be primed with
 * unrelated catalog content.
 *
 * @public
 */
export class ReferenceTemplateLoader {
  constructor(
    private readonly catalog: Pick<CatalogApi, 'getEntityByRef'>,
    private readonly limit: number,
  ) {}

  async load(
    entityRefs: string[],
    options: { credentials?: { token?: string } } = {},
  ): Promise<Entity[]> {
    if (entityRefs.length > this.limit) {
      throw new InputError(
        `At most ${this.limit} reference templates are allowed; got ${entityRefs.length}.`,
      );
    }
    const out: Entity[] = [];
    for (const ref of entityRefs) {
      // Normalises and rejects malformed refs early.
      parseEntityRef(ref);
      const entity = await this.catalog.getEntityByRef(
        ref,
        options.credentials?.token ? { token: options.credentials.token } : {},
      );
      if (!entity) {
        throw new NotFoundError(
          `Reference template '${ref}' was not found in the catalog`,
        );
      }
      if (entity.kind !== 'Template') {
        throw new InputError(
          `Reference '${ref}' is a ${entity.kind}, not a Template`,
        );
      }
      out.push(entity);
    }
    return out;
  }
}
