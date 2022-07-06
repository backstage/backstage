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
import {
  FactLifecycle,
  FactRetriever,
  FactRetrieverContext,
  FactRetrieverRegistration,
  TechInsightFact,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-node';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import { Logger } from 'winston';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Duration } from 'luxon';

function randomDailyCron() {
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);
  return `${rand(0, 59)} ${rand(0, 23)} * * *`;
}

function duration(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}

export class FactRetrieverEngine {
  private constructor(
    private readonly repository: TechInsightsStore,
    private readonly factRetrieverRegistry: FactRetrieverRegistry,
    private readonly factRetrieverContext: FactRetrieverContext,
    private readonly logger: Logger,
    private readonly scheduler: PluginTaskScheduler,
    private readonly defaultCadence?: string,
    private readonly defaultTimeout?: Duration,
  ) {}

  static async create(options: {
    repository: TechInsightsStore;
    factRetrieverRegistry: FactRetrieverRegistry;
    factRetrieverContext: FactRetrieverContext;
    scheduler: PluginTaskScheduler;
    defaultCadence?: string;
    defaultTimeout?: Duration;
  }) {
    const {
      repository,
      factRetrieverRegistry,
      factRetrieverContext,
      scheduler,
      defaultCadence,
      defaultTimeout,
    } = options;

    await Promise.all(
      factRetrieverRegistry
        .listRetrievers()
        .map(it => repository.insertFactSchema(it)),
    );

    return new FactRetrieverEngine(
      repository,
      factRetrieverRegistry,
      factRetrieverContext,
      factRetrieverContext.logger,
      scheduler,
      defaultCadence,
      defaultTimeout,
    );
  }

  async schedule() {
    const registrations = this.factRetrieverRegistry.listRegistrations();
    const newRegs: string[] = [];

    await Promise.all(
      registrations.map(async registration => {
        const { factRetriever, cadence, lifecycle, timeout } = registration;
        const cronExpression =
          cadence || this.defaultCadence || randomDailyCron();
        const timeLimit =
          timeout || this.defaultTimeout || Duration.fromObject({ minutes: 5 });
        try {
          await this.scheduler.scheduleTask({
            id: factRetriever.id,
            frequency: { cron: cronExpression },
            fn: this.createFactRetrieverHandler(factRetriever, lifecycle),
            timeout: timeLimit,
          });
          newRegs.push(factRetriever.id);
        } catch (e) {
          this.logger.warn(
            `Failed to schedule fact retriever ${factRetriever.id}, ${e}`,
          );
        }
      }),
    );

    this.logger.info(
      `Scheduled ${newRegs.length}/${registrations.length} fact retrievers into the tech-insights engine`,
    );
  }

  getJobRegistration(ref: string): FactRetrieverRegistration {
    return this.factRetrieverRegistry.get(ref);
  }

  async triggerJob(ref: string): Promise<void> {
    await this.scheduler.triggerTask(ref);
  }

  private createFactRetrieverHandler(
    factRetriever: FactRetriever,
    lifecycle?: FactLifecycle,
  ) {
    return async () => {
      const startTimestamp = process.hrtime();
      this.logger.info(
        `Retrieving facts for fact retriever ${factRetriever.id}`,
      );

      let facts: TechInsightFact[] = [];
      try {
        facts = await factRetriever.handler({
          ...this.factRetrieverContext,
          entityFilter: factRetriever.entityFilter,
        });
        this.logger.debug(
          `Retrieved ${facts.length} facts for fact retriever ${
            factRetriever.id
          } in ${duration(startTimestamp)}`,
        );
      } catch (e) {
        this.logger.error(
          `Failed to retrieve facts for retriever ${factRetriever.id}`,
          e,
        );
      }

      try {
        await this.repository.insertFacts({
          id: factRetriever.id,
          facts,
          lifecycle,
        });
        this.logger.info(
          `Stored ${facts.length} facts for fact retriever ${
            factRetriever.id
          } in ${duration(startTimestamp)}`,
        );
      } catch (e) {
        this.logger.warn(
          `Failed to insert facts for fact retriever ${factRetriever.id}`,
          e,
        );
      }
    };
  }
}
