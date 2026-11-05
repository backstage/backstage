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

import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  GeneratorBase,
  PreparerBase,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import fs from 'fs-extra';
import * as winston from 'winston';
import { DocsBuilder } from './builder';

const preparedDir = '/prepared/dir';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'documented',
    uid: 'uid-1',
    annotations: {
      'backstage.io/managed-by-location':
        'url:https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
      'backstage.io/techdocs-ref': 'dir:.',
    },
  },
};

function createBuilder(preparer: PreparerBase) {
  const generator: GeneratorBase = {
    run: jest.fn().mockResolvedValue(undefined),
  };
  const publisher: jest.Mocked<PublisherBase> = {
    docsRouter: jest.fn(),
    fetchTechDocsMetadata: jest.fn(),
    getReadiness: jest.fn(),
    hasDocsBeenGenerated: jest.fn().mockResolvedValue(false),
    publish: jest.fn().mockResolvedValue({}),
  };
  const config = new ConfigReader({});
  return new DocsBuilder({
    preparers: { register: jest.fn(), get: () => preparer },
    generators: { register: jest.fn(), get: () => generator },
    publisher,
    entity,
    logger: winston.createLogger({ silent: true }),
    config,
    scmIntegrations: ScmIntegrations.fromConfig(config),
  });
}

describe('DocsBuilder', () => {
  const remove = jest.spyOn(fs, 'remove');

  afterEach(() => remove.mockClear());

  afterAll(() => remove.mockRestore());

  it.each`
    fromResponse | fromPreparer | removed
    ${true}      | ${false}     | ${true}
    ${false}     | ${true}      | ${false}
    ${undefined} | ${true}      | ${true}
    ${undefined} | ${false}     | ${false}
  `(
    'removes the prepared directory: $removed when the response says $fromResponse and the preparer says $fromPreparer',
    async ({ fromResponse, fromPreparer, removed }) => {
      const preparer: PreparerBase = {
        prepare: jest.fn().mockResolvedValue({
          preparedDir,
          etag: 'etag-1',
          shouldCleanPreparedDirectory: fromResponse,
        }),
        shouldCleanPreparedDirectory: () => fromPreparer,
      };

      await expect(createBuilder(preparer).build()).resolves.toBe(true);

      const removedDirs = remove.mock.calls.map(([dir]) => dir);
      expect(removedDirs.includes(preparedDir)).toBe(removed);
    },
  );
});
