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

import { compileDestinationTemplate } from './templates';
import type { DestinationTemplate } from './templates';
import type { AiProviderModule } from './types';

/** Immutable, validated registrations shared by guard and journal. */
export type AiProviderRegistry = Readonly<{
  get(id: string): AiProviderModule | undefined;
  hasOperation(operation: string): boolean;
  canonicalPath(path: string): string | undefined;
}>;

export function createProviderRegistry(
  modules: readonly AiProviderModule[],
): AiProviderRegistry {
  const byId = new Map<string, AiProviderModule>();
  const operations = new Set<string>();
  const templates: Array<(path: string) => string | undefined> = [];
  for (const module of modules) {
    if (
      !module ||
      typeof module.id !== 'string' ||
      !/^[a-z][a-z0-9-]{0,63}$/.test(module.id) ||
      byId.has(module.id)
    ) {
      throw new Error('Invalid or duplicate provider module id');
    }
    if (
      !Array.isArray(module.certifiedOperations) ||
      !Array.isArray(module.destinationTemplates) ||
      module.destinationTemplates.length === 0 ||
      typeof module.destination !== 'function' ||
      typeof module.validateEnvelope !== 'function' ||
      (module.classifyRequest !== undefined &&
        typeof module.classifyRequest !== 'function') ||
      !module.adapter ||
      !['stream', 'custom'].includes(module.adapter.kind)
    ) {
      throw new Error(`Invalid provider module: ${module.id}`);
    }
    if (module.transport !== undefined && module.transport !== 'sse') {
      throw new Error(`Invalid provider transport: ${module.id}`);
    }
    if (
      module.adapter.kind === 'stream' &&
      (typeof module.adapter.stream !== 'function' ||
        typeof module.adapter.streamSimple !== 'function')
    ) {
      throw new Error(`Invalid provider adapter: ${module.id}`);
    }
    if (
      module.adapter.kind === 'custom' &&
      typeof module.adapter.invoke !== 'function'
    ) {
      throw new Error(`Invalid provider adapter: ${module.id}`);
    }
    const certified = [...module.certifiedOperations];
    for (const operation of certified) {
      if (
        typeof operation !== 'string' ||
        !/^[A-Za-z][A-Za-z0-9]{0,63}$/.test(operation)
      ) {
        throw new Error(`Invalid provider operation: ${module.id}`);
      }
      operations.add(`models.${operation}`);
    }
    const destinationTemplates = module.destinationTemplates.map(
      (template: DestinationTemplate) => {
        templates.push(compileDestinationTemplate(template));
        return Object.freeze(template.map(part => Object.freeze({ ...part })));
      },
    );
    byId.set(
      module.id,
      Object.freeze({
        ...module,
        adapter: Object.freeze({ ...module.adapter }),
        certifiedOperations: Object.freeze(certified),
        destinationTemplates: Object.freeze(destinationTemplates),
      }),
    );
  }
  return Object.freeze({
    get: (id: string) => byId.get(id),
    hasOperation: (operation: string) => operations.has(operation),
    canonicalPath: (path: string) => {
      const matches = templates
        .map(match => match(path))
        .filter((value): value is string => value !== undefined);
      // A static route must never reveal a value another matching route marks
      // dynamic. Conflicting dynamic interpretations are refused altogether.
      const dynamic = matches.filter(value => value.includes('{'));
      if (dynamic.length > 0) {
        return dynamic.every(value => value === dynamic[0])
          ? dynamic[0]
          : undefined;
      }
      return matches[0];
    },
  });
}
