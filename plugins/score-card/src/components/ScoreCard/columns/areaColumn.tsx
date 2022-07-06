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

import { TableColumn } from '@backstage/core-components';
import { Chip, Link } from '@material-ui/core';
import { scoreToColorConverter } from '../../../helpers/scoreToColorConverter';
import { SystemScoreTableEntry } from '../helpers/getScoreTableEntries';
import React from 'react';
import { SystemScoreExtended } from '../../../api/types';

export function areaColumn(
  value: SystemScoreExtended | null | undefined,
): TableColumn<SystemScoreTableEntry> {
  return {
    title: 'Area',
    field: 'area',
    grouping: true,
    groupTitle: 'Area',
    defaultGroupOrder: 0,
    width: '1px',
    render: (data, type) => {
      if (type === 'group') {
        // we need to find the area..it's based on title (see allEntries reduce below) as we can used this for ordering too
        const area = value?.areaScores.find(a => a.title === data.toString());
        const areaGateStyle: React.CSSProperties = {
          marginTop: '0.5rem',
          marginRight: '1rem',
          backgroundColor: scoreToColorConverter(area?.scoreSuccess),
          float: 'right',
          minWidth: '4rem',
        };
        const areaGateLabel = `${area?.scorePercent} %`;
        return (
          <span>
            {data}
            <Chip label={areaGateLabel} style={areaGateStyle} />
          </span>
        );
      }
      return <Link>{data.area}</Link>;
    },
  };
}
