/*
 * Copyright 2022 The Backstage Authors
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

import { SystemScoreEntry } from '../../../api';
import { SystemScoreExtended } from '../../../api/types';

// this is an interface used for table entries. We need to enrich the original SystemScoreEntry with the "area" group, see bellow allEntries reduce
export interface SystemScoreTableEntry extends SystemScoreEntry {
  area: string;
}
/*
  here comes the tricky part. We have json like this:
  {
    ...
    areaScores: [
      {
        id: 1,
        title: "documentation",
        ...
        scoreEntries : [ 
          {
            id: 222,
            title: "readme"
          },
          {
            id: 333,
            title: "RFP"
          },
          ... other score entries
        ]
      },
      ... other areas with other score entries
    ] 
  }
  and we want to have a flat array of score entries for table grouped by area, e.g.
  [
    {
      id: 222,
      title: "readme",
      area: "documentation",
      ...
    },
    {
      id: 333,
      title: "RFP",
      area: "documentation",
      ...
    },
    ...
  ]
  so we want to basically go through all areaScores and get all its entries to one big array with a new 
  property "area" pointing back to the area so we can later on get the area score... 
  */
export function getScoreTableEntries(
  value: SystemScoreExtended | null | undefined,
): SystemScoreTableEntry[] {
  if (!value || value.areaScores.length <= 0) return [];
  return value.areaScores.reduce<SystemScoreTableEntry[]>(
    (entries, area) =>
      entries.concat(
        area.scoreEntries.map(entry => {
          return {
            area: area.title,
            ...entry,
          };
        }),
      ),
    [],
  );
}
