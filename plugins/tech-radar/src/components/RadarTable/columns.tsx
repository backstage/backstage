/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { TableColumn } from '@backstage/core-components';
import { RadarEntryTableRow } from './types';
import AdjustIcon from '@material-ui/icons/Adjust';
import { MovedState } from '../../api';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { RadarLegendLink } from '../RadarLegend/RadarLegendLink';

/**
 * Not directly exported, but through DocsTable.columns and EntityListDocsTable.columns
 *
 * @public
 */
export const columnFactories = {
  createTitleColumn(): TableColumn<RadarEntryTableRow> {
    return {
      title: 'Title',
      field: 'title',
      highlight: true,
      render: entry => {
        return (
          <RadarLegendLink
            classes={{ 'text-underline': 'test' }}
            url={entry.url}
            title={entry.title}
            description={entry.description!}
            active={entry.active}
            links={entry.links ?? []}
            timeline={entry.timeline ?? []}
          />
        );
      },
    };
  },
  createQuadrantColumn(): TableColumn<RadarEntryTableRow> {
    return {
      title: 'Quadrant',
      field: 'quadrant.name',
    };
  },
  createRingColumn(): TableColumn<RadarEntryTableRow> {
    return {
      title: 'Ring',
      field: 'ring.name',
      defaultSort: 'asc',
      customSort(data1, data2) {
        if (data1.ring.index === undefined) return -1;
        else if (data2.ring.index === undefined) return 1;
        return (
          data1.ring.index - data2.ring.index ||
          data1.title.localeCompare(data2.title)
        );
      },
    };
  },
  createMovedColumn(): TableColumn<RadarEntryTableRow> {
    return {
      title: 'Movement',
      field: 'moved',
      render: ({ moved }) => {
        if (moved === MovedState.NoChange) {
          return <AdjustIcon />;
        } else if (moved === MovedState.Up) {
          return <ArrowUpwardIcon />;
        } else if (moved === MovedState.Down) {
          return <ArrowDownwardIcon />;
        }
        return null;
      },
    };
  },
  createSeeMoreColumn(): TableColumn<RadarEntryTableRow> {
    return {
      title: 'Movement',
      field: 'moved',
    };
  },
  // name,
};
