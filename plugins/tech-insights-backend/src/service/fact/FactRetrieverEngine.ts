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
  FactRetriever,
  FactRetrieverContext,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-common';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import { schedule, validate, ScheduledTask } from 'node-cron';
import { Logger } from 'winston';

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
  private scheduledJobs = new Map<string, ScheduledTask>();

  constructor(
    private readonly repository: TechInsightsStore,
    private readonly factRetrieverRegistry: FactRetrieverRegistry,
    private readonly factRetrieverContext: FactRetrieverContext,
    private readonly logger: Logger,
    private readonly defaultCadence?: string,
  ) {}

  static async create({
    repository,
    factRetrieverRegistry,
    factRetrieverContext,
    defaultCadence,
  }: {
    repository: TechInsightsStore;
    factRetrieverRegistry: FactRetrieverRegistry;
    factRetrieverContext: FactRetrieverContext;
    defaultCadence?: string;
  }) {
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
      defaultCadence,
    );
  }

  schedule() {
    const registrations = this.factRetrieverRegistry.listRegistrations();
    const newRegs: string[] = [];
    registrations.forEach(registration => {
      const { factRetriever, cadence } = registration;
      if (!this.scheduledJobs.has(factRetriever.id)) {
        const cronExpression =
          cadence || this.defaultCadence || randomDailyCron();
        if (!validate(cronExpression)) {
          this.logger.warn(
            `Validation failed for cron expression ${cronExpression} when trying to schedule fact retriever ${factRetriever.id}`,
          );
          return;
        }
        const job = schedule(
          cronExpression,
          this.createFactRetrieverHandler(factRetriever),
        );
        this.scheduledJobs.set(factRetriever.id, job);
        newRegs.push(factRetriever.id);
      }
    });
    this.logger.info(
      `Scheduled ${newRegs.length} fact retrievers to Fact Retriever Engine.`,
    );
  }

  getJob(ref: string) {
    return this.scheduledJobs.get(ref);
  }

  private createFactRetrieverHandler(factRetriever: FactRetriever) {
    return async () => {
      const startTimestamp = process.hrtime();
      this.logger.info(
        `Retrieving facts for fact retriever ${factRetriever.id}`,
      );
      const facts = await factRetriever.handler(this.factRetrieverContext);
      if (this.logger.isDebugEnabled()) {
        this.logger.debug(
          `Retrieved ${facts.length} facts for fact retriever ${
            factRetriever.id
          } in ${duration(startTimestamp)}`,
        );
      }

      try {
        await this.repository.insertFacts(factRetriever.id, facts);
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
