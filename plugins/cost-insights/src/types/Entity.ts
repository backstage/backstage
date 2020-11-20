/*
 * Copyright 2020 Spotify AB
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

import { ChangeStatistic } from './ChangeStatistic';
import { Maybe } from './Maybe';

export interface Entity {
  id: Maybe<string>;
  aggregation: [number, number];
  entities: Entity[];
  change: ChangeStatistic;
}

/*
  An entity is a tree-like structure that represents any unique
  product or service that generates cost over a fixed period of time.
  An entity could be atomic or composite. An atomic entity is indivisible
  and cannot be broken into sub-entities.

  A composite entity can be broken down recursively into sub-entities
  that generate cost **over the same time period**. All costs must sum to the root cost.

  Entities with null ids are considered "unlabeled" - costs without attribution.
  If an entity is a composite, it may only have one (1) null child but may have any number of
  null grandchildren.

  {
    id: 'product',
    aggregation: [0, 200],
    change: {
      ratio: 2000,
      amount: 200
    },
    entities: [
      {
        id: 'service-a',
        aggregation: [0, 100],
        change: {
          ratio: 100,
          amount: 100
        },
        entities: []
      },
      {
        id: 'service-b',
        aggregation: [0, 100],
        change: {
          ratio: 100,
          amount: 100
        },
        entities: [
          {
            id: 'service-b-sku-a',
            aggregation: [0, 25],
            change: {
              ratio: 25,
              amount: 25
            },
            entities: []
          },
          {
            id: null, // Unlabeled cost for service-b
            aggregation: [0, 75],
            change: {
              ratio: 75,
              amount: 75
            },
            entities: []
          },
        ]
      },
    ]
  }
*/
