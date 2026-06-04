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
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

/**
 * A single catalog entity scored against the user's question.
 * @public
 */
export interface ScoredEntity {
  entity: Entity;
  entityRef: string;
  score: number;
}

/**
 * Retrieves catalog entities relevant to a natural-language question.
 *
 * This first revision uses a deterministic substring / token-overlap score
 * across `metadata.name`, `metadata.title`, `metadata.description`,
 * `metadata.tags`, `kind`, and `spec.type`. It is intentionally simple so the
 * Q&A pipeline ships without an embedding store; a semantic retriever can
 * replace this class behind the same interface later.
 *
 * @public
 */
export class CatalogContextRetriever {
  constructor(
    private readonly catalog: Pick<CatalogApi, 'getEntities'>,
    private readonly limit: number,
  ) {}

  async retrieve(
    question: string,
    options: { credentials?: { token?: string } } = {},
  ): Promise<ScoredEntity[]> {
    const tokens = tokenize(question);
    if (tokens.length === 0) return [];

    const { items } = await this.catalog.getEntities(
      {},
      options.credentials?.token ? { token: options.credentials.token } : {},
    );

    const scored = items
      .map(entity => ({
        entity,
        entityRef: stringifyEntityRef(entity),
        score: scoreEntity(entity, tokens),
      }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.limit);

    return scored;
  }
}

const STOPWORDS = new Set([
  'the',
  'and',
  'for',
  'are',
  'with',
  'what',
  'who',
  'which',
  'does',
  'do',
  'is',
  'on',
  'in',
  'at',
  'to',
  'of',
  'a',
  'an',
  'how',
  'why',
  'where',
  'this',
  'that',
  'use',
  'uses',
  'using',
  'used',
  'service',
  'services',
  'about',
  'has',
  'have',
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !STOPWORDS.has(t));
}

function scoreEntity(entity: Entity, tokens: string[]): number {
  // Build a corpus of text fields, each with a weight.
  const corpus: Array<{ text: string; weight: number }> = [
    { text: entity.metadata.name, weight: 4 },
    { text: entity.metadata.title ?? '', weight: 3 },
    { text: entity.metadata.description ?? '', weight: 2 },
    { text: entity.kind, weight: 1 },
    {
      text: String(
        (entity.spec as Record<string, unknown> | undefined)?.type ?? '',
      ),
      weight: 1,
    },
    { text: (entity.metadata.tags ?? []).join(' '), weight: 2 },
  ];

  let total = 0;
  for (const token of tokens) {
    for (const { text, weight } of corpus) {
      if (!text) continue;
      const haystack = text.toLowerCase();
      if (haystack === token) {
        total += weight * 3; // exact field match dominates
      } else if (haystack.split(/[\s-]+/).includes(token)) {
        total += weight * 2;
      } else if (haystack.includes(token)) {
        total += weight;
      }
    }
  }
  return total;
}
