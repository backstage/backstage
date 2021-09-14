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
import { DateTime } from 'luxon';
import { FactRetriever } from '../types';

// @ts-ignore
import { CatalogClient } from '@backstage/catalog-client';

export const exampleFactRetriever = {
  ref: 'demo-poc.factretriever',
  schema: {
    version: '0.1.0',
    schema: {
      examplenumberfact: {
        type: 'integer',
      },
      examplestringfact: {
        type: 'string',
      },
      examplefloatfact: {
        type: 'float',
      },
      examplebooleanfact: {
        type: 'boolean',
      },
      exampledatetimefact: {
        type: 'datetime',
      },
    },
  },
  handler: async _ctx => {
    /*
      const { config, discovery } = _ctx;
      const catalogClient = new CatalogClient({ discoveryApi: discovery });
      const entities = await catalogClient.getEntities();
      const url = config.getString('some.needed.configvalue');
      // do api call, map response values to entities.
      */

    return Promise.resolve([
      {
        ref: 'demo-poc.factretriever',
        entity: {
          namespace: 'a',
          kind: 'a',
          name: 'a',
        },
        facts: {
          examplenumberfact: 2,
          examplestringfact: 'stringy',
          examplefloatfact: 0.331,
          examplebooleanfact: false,
          exampledatetimefact: DateTime.now(),
        },
      },
    ]);
  },
} as FactRetriever;
