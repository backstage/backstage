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
import { TechInsightsStore } from './TechInsightsDatabase';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import cron, { ScheduledTask } from 'node-cron';
import { FactRetrieverContext } from '../types';

function randomInt(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export class FactRetrieverEngine {
  private scheduledJobs = new Map<string, ScheduledTask>();

  static async create(
    repository: TechInsightsStore,
    factRetrieverRegistry: FactRetrieverRegistry,
    factRetrieverContext: FactRetrieverContext,
  ) {
    await Promise.all(
      factRetrieverRegistry
        .listRetrievers()
        .map(it => repository.insertFactSchema(it.ref, it.schema)),
    );

    return new FactRetrieverEngine(
      repository,
      factRetrieverRegistry,
      factRetrieverContext,
    );
  }

  constructor(
    readonly repository: TechInsightsStore,
    readonly factRetrieverRegistry: FactRetrieverRegistry,
    readonly factRetrieverContext: FactRetrieverContext,
  ) {}

  schedule() {
    const registrations = this.factRetrieverRegistry.listRegistrations();
    registrations.forEach(registration => {
      const { factRetriever, cadence } = registration;
      if (!this.scheduledJobs.has(factRetriever.ref)) {
        const randomDailyCron = `${randomInt(0, 59)} ${randomInt(0, 23)} * * *`;
        const job = cron.schedule(cadence || randomDailyCron, async () => {
          const facts = await factRetriever.handler(this.factRetrieverContext);
          try {
            await this.repository.insertFacts(facts);
          } catch (e) {
            console.log('Failed to insert facts', e);
          }
        });
        this.scheduledJobs.set(factRetriever.ref, job);
      }
    });
  }

  getJob(ref: string) {
    return this.scheduledJobs.get(ref);
  }
}
