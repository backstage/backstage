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
import { Knex } from 'knex';
import {
  FactSchema,
  TechInsightFact,
  FlatTechInsightFact,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-common';
import { rsort } from 'semver';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import { Logger } from 'winston';

export type RawDbFactRow = {
  ref: string;
  version: string;
  timestamp: Date | string;
  entity: string;
  facts: string;
};

type RawDbFactSchemaRow = {
  id: number;
  ref: string;
  version: string;
  schema: string;
};

export class TechInsightsDatabase implements TechInsightsStore {
  private readonly CHUNK_SIZE = 50;

  constructor(private readonly db: Knex, private readonly logger: Logger) {}

  async getLatestSchemas(refs?: string[]): Promise<FactSchema[]> {
    const queryBuilder = this.db<RawDbFactSchemaRow>('fact_schemas');
    if (refs) {
      queryBuilder.whereIn('ref', refs);
    }
    const existingSchemas = await queryBuilder.orderBy('id', 'desc').select();

    const groupedSchemas = groupBy(existingSchemas, 'ref');
    return Object.values(groupedSchemas)
      .map(schemas => {
        const sorted = rsort(schemas.map(it => it.version));
        return schemas.find(it => it.version === sorted[0])!!;
      })
      .map((it: RawDbFactSchemaRow) => ({
        ...it,
        schema: JSON.parse(it.schema),
      }));
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

  async insertFacts(ref: string, facts: TechInsightFact[]): Promise<void> {
    if (facts.length === 0) return;
    const currentSchema = await this.getLatestSchema(ref);
    const factRows = facts.map(it => {
      const { namespace, name, kind } = it.entity;
      return {
        ref: ref,
        version: currentSchema.version,
        entity: `${namespace}/${kind}/${name}`.toLocaleLowerCase('en-US'),
        facts: JSON.stringify(it.facts),
        ...(it.timestamp && { timestamp: it.timestamp.toJSDate() }),
      };
    });
    await this.db.transaction(async tx => {
      await tx.batchInsert<RawDbFactRow>('facts', factRows, this.CHUNK_SIZE);
    });
  }

  async getLatestFactsForRefs(
    refs: string[],
    entityTriplet: string,
  ): Promise<{ [p: string]: FlatTechInsightFact }> {
    const results = await this.db<RawDbFactRow>('facts')
      .where({ entity: entityTriplet })
      .and.whereIn('ref', refs)
      .join(
        this.db('facts')
          .max('timestamp')
          .column('ref as subRef')
          .groupBy('ref')
          .as('subQ'),
        'facts.ref',
        'subQ.subRef',
      );
    return this.dbFactRowsToTechInsightFacts(results);
  }

  async getFactsBetweenTimestampsForRefs(
    refs: string[],
    entityTriplet: string,
    startDateTime: DateTime,
    endDateTime: DateTime,
  ): Promise<{
    [p: string]: FlatTechInsightFact[];
  }> {
    const results = await this.db<RawDbFactRow>('facts')
      .where({ entity: entityTriplet })
      .and.whereIn('ref', refs)
      .and.whereBetween('timestamp', [
        startDateTime.toISO(),
        endDateTime.toISO(),
      ]);

    return groupBy(
      results.map(it => {
        const [namespace, kind, name] = it.entity.split('/');
        const timestamp =
          typeof it.timestamp === 'string'
            ? DateTime.fromISO(it.timestamp)
            : DateTime.fromJSDate(it.timestamp);
        return {
          ref: it.ref,
          entity: { namespace, kind, name },
          timestamp,
          version: it.version,
          facts: JSON.parse(it.facts),
        };
      }),
      'ref',
    );
  }

  private async getLatestSchema(ref: string): Promise<RawDbFactSchemaRow> {
    const existingSchemas = await this.db<RawDbFactSchemaRow>('fact_schemas')
      .where({ ref })
      .orderBy('id', 'desc')
      .select();
    if (existingSchemas.length < 1) {
      this.logger.warn(`No schema found for ${ref}. `);
      throw new Error(`No schema found for ${ref}. `);
    }
    const sorted = rsort(existingSchemas.map(it => it.version));
    return existingSchemas.find(it => it.version === sorted[0])!!;
  }

  private dbFactRowsToTechInsightFacts(rows: RawDbFactRow[]) {
    return rows.reduce((acc, it) => {
      const [namespace, kind, name] = it.entity.split('/');
      const timestamp =
        typeof it.timestamp === 'string'
          ? DateTime.fromISO(it.timestamp)
          : DateTime.fromJSDate(it.timestamp);
      return {
        ...acc,
        [it.ref]: {
          ref: it.ref,
          entity: { namespace, kind, name },
          timestamp,
          version: it.version,
          facts: JSON.parse(it.facts),
        },
      };
    }, {});
  }
}
