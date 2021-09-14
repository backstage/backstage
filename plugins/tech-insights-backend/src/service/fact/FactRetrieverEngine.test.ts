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
  FactRetrieverRegistration,
  FactSchema,
  TechInsightFact,
  TechInsightsStore,
} from '@backstage/plugin-tech-insights-common';
import { FactRetrieverRegistry } from './FactRetrieverRegistry';
import { FactRetrieverEngine } from './FactRetrieverEngine';
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { schedule } from 'node-cron';

jest.mock('node-cron', () => {
  const original = jest.requireActual('node-cron');
  return {
    ...original,
    schedule: jest.fn(),
  };
});

const testFactRetriever: FactRetriever = {
  ref: 'test-factretriever',
  schema: {
    version: '0.0.1',
    schema: {
      testnumberfact: {
        type: 'integer',
        description: '',
        entityKinds: ['component'],
      },
    },
  },
  handler: async () => {
    return [
      {
        ref: 'test-factretriever',
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          testnumberfact: 1,
        },
      },
    ];
  },
};
const cadence = '1 * * * *';
describe('FactRetrieverEngine', () => {
  let engine: FactRetrieverEngine;
  let factSchemaAssertionCallback: (ref: string, schema: FactSchema) => void;
  let factInsertionAssertionCallback: (facts: TechInsightFact[]) => void;

  const mockRepository: TechInsightsStore = {
    insertFacts: (facts: TechInsightFact[]) => {
      factInsertionAssertionCallback(facts);
      return Promise.resolve();
    },
    insertFactSchema: (ref: string, schema: FactSchema) => {
      factSchemaAssertionCallback(ref, schema);
      return Promise.resolve();
    },
  } as unknown as TechInsightsStore;

  const mockFactRetrieverRegistry: FactRetrieverRegistry = {
    listRetrievers(): FactRetriever[] {
      return [testFactRetriever];
    },
    listRegistrations(): FactRetrieverRegistration[] {
      return [{ factRetriever: testFactRetriever, cadence }];
    },
  } as unknown as FactRetrieverRegistry;

  const defaultEngineConfig = {
    factRetrieverContext: {
      logger: getVoidLogger(),
      config: ConfigReader.fromConfigs([]),
      discovery: {
        getBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
        getExternalBaseUrl: (_: string) => Promise.resolve('http://mock.url'),
      },
    },
    factRetrieverRegistry: mockFactRetrieverRegistry,
    repository: mockRepository,
  };

  it('Should update fact retriever schemas on initialization', async () => {
    factSchemaAssertionCallback = (ref, schema) => {
      expect(ref).toEqual('test-factretriever');
      expect(schema).toEqual({
        version: '0.0.1',
        schema: {
          testnumberfact: {
            type: 'integer',
            description: '',
            entityKinds: ['component'],
          },
        },
      });
    };

    engine = await FactRetrieverEngine.fromConfig(defaultEngineConfig);
  });
  it('Should insert facts when scheduled step is run', async () => {
    (schedule as jest.Mock).mockImplementation(
      (cronCadence: string, retrieverAction: Function) => {
        return {
          cadence: cronCadence,
          triggerScheduledJobNow: retrieverAction,
        };
      },
    );

    factSchemaAssertionCallback = () => {};
    factInsertionAssertionCallback = facts => {
      expect(facts).toHaveLength(1);
      expect(facts[0]).toEqual({
        ref: 'test-factretriever',
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          testnumberfact: 1,
        },
      });
    };
    engine = await FactRetrieverEngine.fromConfig(defaultEngineConfig);
    engine.schedule();
    const job: any = engine.getJob('test-factretriever');
    job.triggerScheduledJobNow();
    expect(job.cadence!!).toEqual(cadence);
  });
});
