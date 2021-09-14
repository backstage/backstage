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
import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';
import { FactSchema, TechInsightFact } from '../types';

export type RawDbFactRow = {
  ref: string;
  version: string;
  timestamp: string;
  entity: string;
  facts: string;
};

type RawDbFactSchemaRow = {
  id: number;
  ref: string;
  version: string;
  schema: string;
};

export interface TechInsightsStore {
  insertFacts(facts: TechInsightFact[]): Promise<void>;

  retrieveLatestFactsForRefs(
    refs: string[],
    entity: string,
  ): Promise<{ [factRef: string]: TechInsightFact }>;

  insertFactSchema(ref: string, schema: FactSchema): Promise<void>;
}

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-tech-insights-backend',
  'migrations',
);

export class TechInsightsDatabase implements TechInsightsStore {
  private readonly CHUNK_SIZE = 50;
  static async create(knex: Knex): Promise<TechInsightsStore> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new TechInsightsDatabase(knex);
  }

  constructor(private readonly db: Knex) {}

  // We should probably get this based on version instead of insert order
  private async getLatestSchema(ref: string): Promise<RawDbFactSchemaRow> {
    const existingSchemas = await this.db<RawDbFactSchemaRow>('fact_schemas')
      .where({ ref })
      .orderBy('id', 'desc')
      .limit(1)
      .select();
    if (existingSchemas.length < 1) {
      throw new Error(`No schema found for ${ref}. `);
    }
    return existingSchemas[0];
  }

  async insertFactSchema(ref: string, schema: FactSchema) {
    const existingSchemas = await this.db<RawDbFactSchemaRow>('fact_schemas')
      .where({ ref })
      .select();
    const exists = existingSchemas.some(
      it => it.ref === ref && it.version === schema.version,
    );

    if (!exists) {
      await this.db<RawDbFactSchemaRow>('fact_schemas').insert({
        ref,
        version: schema.version,
        schema: JSON.stringify(schema.schema),
      });
    }
  }

  async insertFacts(facts: TechInsightFact[]): Promise<void> {
    console.log(`inserting facts: ${JSON.stringify(facts)}`);

    const tx = await this.db.transaction();
    if (facts.length === 0) return;
    const currentSchema = await this.getLatestSchema(facts[0].ref);
    const factRows = facts.map(it => {
      const { namespace, name, kind } = it.entity;
      return {
        ref: it.ref,
        version: currentSchema.version,
        entity: `${namespace.toLowerCase()}/${kind.toLowerCase()}/${name.toLowerCase()}`,
        facts: JSON.stringify(it.facts),
      };
    });

    await tx.batchInsert<RawDbFactRow>('facts', factRows, this.CHUNK_SIZE);
    tx.commit();
  }

  async retrieveLatestFactsForRefs(
    refs: string[],
    entityTriplet: string,
  ): Promise<{ [p: string]: TechInsightFact }> {
    // TODO: Knexify
    const results = await this.db.raw(
      `SELECT * from facts f
    WHERE entity = ?
    AND f.ref IN (${refs.map(_ => '?').join(',')})
          AND f.timestamp =
        (SELECT max(f2.timestamp) FROM facts f2 WHERE f.ref = f2.ref)`,
      [entityTriplet, ...refs],
    );

    return results.rows.map((it: RawDbFactRow) => {
      const [namespace, kind, name] = it.entity.split('/');
      return {
        ref: it.ref,
        entity: { namespace, kind, name },
        facts: JSON.parse(it.facts),
      };
    });
  }
}
