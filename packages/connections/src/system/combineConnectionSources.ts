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
import { RootConnection } from '../api/Connection';

/**
 * Merges connections derived from legacy `integrations.*` config with
 * connections defined explicitly in `connections:` config.
 *
 * If any entry in `fromConfig` declares a given connection type, all legacy
 * entries of that type are discarded — the connections config fully takes
 * over for that type. A single warning is logged per discarded type.
 */
export function combineConnectionSources(
  legacy: RootConnection[],
  fromConfig: RootConnection[],
  logger: LoggerService,
): RootConnection[] {
  const typeOf = (c: RootConnection) => c.type as string;
  const typesInConfig = new Set(fromConfig.map(typeOf));

  const warned = new Set<string>();
  const result: RootConnection[] = [];

  for (const legacyConn of legacy) {
    const type = typeOf(legacyConn);
    if (typesInConfig.has(type)) {
      if (!warned.has(type)) {
        warned.add(type);
        logger.warn(
          `Connection type "${type}" is defined in both legacy integrations and connections config; legacy integrations of this type are ignored.`,
        );
      }
      continue;
    }
    result.push(legacyConn);
  }

  result.push(...fromConfig);

  return result;
}
