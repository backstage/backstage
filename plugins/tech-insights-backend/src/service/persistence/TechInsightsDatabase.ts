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
  FactSchemaDefinition,
} from '@backstage/plugin-tech-insights-node';
import { rsort } from 'semver';
import { groupBy, omit } from 'lodash';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { parseEntityName, stringifyEntityRef } from '@backstage/catalog-model';

export type RawDbFactRow = {
  id: string;
  version: string;
  timestamp: Date | string;
  entity: string;
  facts: string;
};

type RawDbFactSchemaRow = {
  id: string;
  version: string;
  schema: string;
  entityFilter?: string;
};

export class TechInsightsDatabase implements TechInsightsStore {
  private readonly CHUNK_SIZE = 50;

  constructor(private readonly db: Knex, private readonly logger: Logger) {}

  async getLatestSchemas(ids?: string[]): Promise<FactSchema[]> {
    const queryBuilder = this.db<RawDbFactSchemaRow>('fact_schemas');
    if (ids) {
      queryBuilder.whereIn('id', ids);
    }
    const existingSchemas = await queryBuilder.orderBy('id', 'desc').select();

    const groupedSchemas = groupBy(existingSchemas, 'id');
    return Object.values(groupedSchemas)
      .map(schemas => {
        const sorted = rsort(schemas.map(it => it.version));
        return schemas.find(it => it.version === sorted[0])!!;
      })
      .map((it: RawDbFactSchemaRow) => ({
        ...omit(it, 'schema'),
        ...JSON.parse(it.schema),
        entityFilter: it.entityFilter ? JSON.parse(it.entityFilter) : null,
      }));
  }

  async insertFactSchema(schemaDefinition: FactSchemaDefinition) {
    const { id, version, schema, entityFilter } = schemaDefinition;
    const existingSchemas = await this.db<RawDbFactSchemaRow>('fact_schemas')
      .where({ id })
      .and.where({ version })
      .select();

    if (!existingSchemas || existingSchemas.length === 0) {
      await this.db<RawDbFactSchemaRow>('fact_schemas').insert({
        id,
        version,
        entityFilter: entityFilter ? JSON.stringify(entityFilter) : undefined,
        schema: JSON.stringify(schema),
      });
    }
  }

  async insertFacts(id: string, facts: TechInsightFact[]): Promise<void> {
    if (facts.length === 0) return;
    const currentSchema = await this.getLatestSchema(id);
    const factRows = facts.map(it => {
      return {
        id,
        version: currentSchema.version,
        entity: stringifyEntityRef(it.entity),
        facts: JSON.stringify(it.facts),
        ...(it.timestamp && { timestamp: it.timestamp.toJSDate() }),
      };
    });
    await this.db.transaction(async tx => {
      await tx.batchInsert<RawDbFactRow>('facts', factRows, this.CHUNK_SIZE);
    });
  }

  async getLatestFactsByIds(
    ids: string[],
    entityTriplet: string,
  ): Promise<{ [factId: string]: FlatTechInsightFact }> {
    const results = await this.db<RawDbFactRow>('facts')
      .where({ entity: entityTriplet })
      .and.whereIn('id', ids)
      .join(
        this.db('facts')
          .max('timestamp')
          .column('id as subId')
          .groupBy('id')
          .as('subQ'),
        'facts.id',
        'subQ.subId',
      );
    return this.dbFactRowsToTechInsightFacts(results);
  }

  async getFactsBetweenTimestampsByIds(
    ids: string[],
    entityTriplet: string,
    startDateTime: DateTime,
    endDateTime: DateTime,
  ): Promise<{
    [factId: string]: FlatTechInsightFact[];
  }> {
    const results = await this.db<RawDbFactRow>('facts')
      .where({ entity: entityTriplet })
      .and.whereIn('id', ids)
      .and.whereBetween('timestamp', [
        startDateTime.toISO(),
        endDateTime.toISO(),
      ]);

    return groupBy(
      results.map(it => {
        const { namespace, kind, name } = parseEntityName(it.entity);
        const timestamp =
          typeof it.timestamp === 'string'
            ? DateTime.fromISO(it.timestamp)
            : DateTime.fromJSDate(it.timestamp);
        return {
          id: it.id,
          entity: { namespace, kind, name },
          timestamp,
          version: it.version,
          facts: JSON.parse(it.facts),
        };
      }),
      'id',
    );
  }

  private async getLatestSchema(id: string): Promise<RawDbFactSchemaRow> {
    const existingSchemas = await this.db<RawDbFactSchemaRow>('fact_schemas')
      .where({ id })
      .orderBy('id', 'desc')
      .select();
    if (existingSchemas.length < 1) {
      this.logger.warn(`No schema found for ${id}. `);
      throw new Error(`No schema found for ${id}. `);
    }
    const sorted = rsort(existingSchemas.map(it => it.version));
    return existingSchemas.find(it => it.version === sorted[0])!!;
  }

  private dbFactRowsToTechInsightFacts(rows: RawDbFactRow[]) {
    return rows.reduce((acc, it) => {
      const { namespace, kind, name } = parseEntityName(it.entity);
      const timestamp =
        typeof it.timestamp === 'string'
          ? DateTime.fromISO(it.timestamp)
          : DateTime.fromJSDate(it.timestamp);
      return {
        ...acc,
        [it.id]: {
          id: it.id,
          entity: { namespace, kind, name },
          timestamp,
          version: it.version,
          facts: JSON.parse(it.facts),
        },
      };
    }, {});
  }
}
