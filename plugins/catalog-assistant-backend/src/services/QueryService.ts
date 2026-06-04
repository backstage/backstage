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

import { LoggerService } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import {
  CatalogContextRetriever,
  ScoredEntity,
} from './CatalogContextRetriever';

/**
 * Minimal generateText shape we depend on from the Vercel AI SDK.
 * Extracted so tests can stub it without pulling in real model weights.
 * @public
 */
export type GenerateTextFn = (args: {
  model: unknown;
  system: string;
  prompt: string;
  maxOutputTokens?: number;
}) => Promise<{ text: string }>;

/**
 * @public
 */
export interface QueryResult {
  answer: string;
  citations: string[];
}

/**
 * Glues retrieval + LLM call: takes a natural-language question, retrieves
 * top-N catalog entities, builds a grounded prompt, calls the LLM, and
 * returns the answer along with entity refs cited as context.
 *
 * @public
 */
export class QueryService {
  constructor(
    private readonly retriever: CatalogContextRetriever,
    private readonly model: unknown,
    private readonly generateText: GenerateTextFn,
    private readonly logger: LoggerService,
    private readonly maxOutputTokens: number,
  ) {}

  private static readonly SYSTEM_PROMPT = `You answer questions about a Backstage software catalog.
Use only the catalog entities provided in the user message as your source of
truth. If the entities do not contain the answer, say so plainly — do not
fabricate ownership, dependencies, or relationships.

When you cite an entity, refer to it by its entity reference
(e.g. "component:default/payments-api"). Be concise.`;

  async query(
    question: string,
    options: { credentials?: { token?: string } } = {},
  ): Promise<QueryResult> {
    const trimmed = question.trim();
    if (!trimmed) {
      throw new InputError('question must not be empty');
    }

    const scored = await this.retriever.retrieve(trimmed, options);
    if (scored.length === 0) {
      return {
        answer:
          "I couldn't find any catalog entities relevant to that question.",
        citations: [],
      };
    }

    const prompt = buildPrompt(trimmed, scored);
    this.logger.debug(
      `catalog-assistant: ${scored.length} entities retrieved for question`,
    );

    const { text } = await this.generateText({
      model: this.model,
      system: QueryService.SYSTEM_PROMPT,
      prompt,
      maxOutputTokens: this.maxOutputTokens,
    });

    return {
      answer: text.trim(),
      citations: scored.map(s => s.entityRef),
    };
  }
}

function buildPrompt(question: string, scored: ScoredEntity[]): string {
  const ctx = scored
    .map(
      (s, i) =>
        `--- entity ${i + 1} (${s.entityRef}) ---\n${summarize(s.entity)}`,
    )
    .join('\n\n');
  return `Catalog entities relevant to the question:\n\n${ctx}\n\nQuestion: ${question}\n\nAnswer:`;
}

function summarize(entity: Entity): string {
  const spec = (entity.spec ?? {}) as Record<string, unknown>;
  const lines: string[] = [
    `kind: ${entity.kind}`,
    `name: ${entity.metadata.name}`,
  ];
  if (entity.metadata.namespace) {
    lines.push(`namespace: ${entity.metadata.namespace}`);
  }
  if (entity.metadata.title) {
    lines.push(`title: ${entity.metadata.title}`);
  }
  if (entity.metadata.description) {
    lines.push(`description: ${entity.metadata.description}`);
  }
  if (spec.type) lines.push(`type: ${String(spec.type)}`);
  if (spec.owner) lines.push(`owner: ${String(spec.owner)}`);
  if (spec.lifecycle) lines.push(`lifecycle: ${String(spec.lifecycle)}`);
  if (spec.system) lines.push(`system: ${String(spec.system)}`);
  if (Array.isArray(spec.dependsOn) && spec.dependsOn.length > 0) {
    lines.push(`dependsOn: ${(spec.dependsOn as string[]).join(', ')}`);
  }
  if (Array.isArray(spec.providesApis) && spec.providesApis.length > 0) {
    lines.push(`providesApis: ${(spec.providesApis as string[]).join(', ')}`);
  }
  if (Array.isArray(spec.consumesApis) && spec.consumesApis.length > 0) {
    lines.push(`consumesApis: ${(spec.consumesApis as string[]).join(', ')}`);
  }
  if (Array.isArray(entity.metadata.tags) && entity.metadata.tags.length > 0) {
    lines.push(`tags: ${entity.metadata.tags.join(', ')}`);
  }
  return lines.join('\n');
}
