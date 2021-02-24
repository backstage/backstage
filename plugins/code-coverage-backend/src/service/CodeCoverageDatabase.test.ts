/*
 * Copyright 2021 Spotify AB
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
  getVoidLogger,
  SingleConnectionDatabaseManager,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  CodeCoverageDatabase,
  CodeCoverageStore,
} from './CodeCoverageDatabase';
import { JsonCodeCoverage } from './jsoncoverage-types';

const db = SingleConnectionDatabaseManager.fromConfig(
  new ConfigReader({
    backend: {
      database: {
        client: 'sqlite3',
        connection: ':memory:',
      },
    },
  }),
).forPlugin('code-coverage');

const coverage: Array<JsonCodeCoverage> = [
  {
    metadata: {
      generationTime: 1234567890,
      vcs: {
        location: 'local',
        type: 'local',
      },
    },
    entity: {
      kind: 'Component',
      name: 'test-entity',
      namespace: 'default',
    },
    files: [
      {
        filename: 'src/main.py',
        lineHits: {
          '10': 5,
          '11': 4,
          '12': 4,
        },
        branchHits: {},
      },
    ],
  },
  {
    metadata: {
      generationTime: 2345678901,
      vcs: {
        location: 'local',
        type: 'local',
      },
    },
    entity: {
      kind: 'Component',
      name: 'test-entity',
      namespace: 'default',
    },
    files: [
      {
        filename: 'src/main.py',
        lineHits: {
          '10': 5,
          '11': 4,
          '12': 4,
          '22': 0,
          '23': 0,
          '24': 0,
          '30': 1,
        },
        branchHits: {
          '10': {
            available: 2,
            covered: 1,
            missed: 1,
          },
        },
      },
    ],
  },
];

let database: CodeCoverageStore;
describe('CodeCoverageDatabase', () => {
  beforeAll(async () => {
    const client = await db.getClient();
    database = await CodeCoverageDatabase.create(client, getVoidLogger());
    database.insertCodeCoverage(coverage[0]);
    await new Promise(r => setTimeout(r, 1000));
    database.insertCodeCoverage(coverage[1]);
  });

  describe('insertCodeCoverage', () => {
    it('can insert code coverage', async () => {
      const ncov = {
        metadata: {
          generationTime: 3456789012,
          vcs: {
            location: 'local',
            type: 'local',
          },
        },
        entity: {
          kind: 'Component',
          name: 'test-entity-for-insert',
          namespace: 'default',
        },
        files: [
          {
            filename: 'src/main.py',
            lineHits: {
              '10': 5,
              '11': 4,
              '12': 4,
            },
            branchHits: {},
          },
        ],
      };
      const { codeCoverageId } = await database.insertCodeCoverage(ncov);
      expect(codeCoverageId.length).not.toBe(0);
    });
  });

  describe('getCodeCoverage', () => {
    it("can get coverage that's in the database", async () => {
      const cov = await database.getCodeCoverage({
        name: 'test-entity',
        kind: 'Component',
        namespace: 'default',
      });
      expect(cov).toEqual(coverage[1]);
    });
  });

  describe('getHistory', () => {
    it("can get history that's in the database", async () => {
      const cov = await database.getHistory(
        {
          name: 'test-entity',
          kind: 'Component',
          namespace: 'default',
        },
        5,
      );
      expect(cov.history.length).toEqual(2);
      expect(cov.history).toEqual([
        {
          branch: {
            available: 2,
            covered: 1,
            missed: 1,
            percentage: 50,
          },
          line: {
            available: 7,
            covered: 4,
            missed: 3,
            percentage: 57.14,
          },
          timestamp: 2345678901,
        },
        {
          branch: {
            available: 0,
            covered: 0,
            missed: 0,
            percentage: 0,
          },
          line: {
            available: 3,
            covered: 3,
            missed: 0,
            percentage: 100,
          },
          timestamp: 1234567890,
        },
      ]);
    });
  });
});
