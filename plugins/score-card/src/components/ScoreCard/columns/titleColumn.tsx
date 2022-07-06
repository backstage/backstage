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
import { Link } from '@material-ui/core';
import React from 'react';
import { SystemScoreTableEntry } from '../helpers/getScoreTableEntries';

export const titleColumn: TableColumn<SystemScoreTableEntry> = {
  title: <div style={{ minWidth: '7rem' }}>Requirement</div>,
  field: 'title',
  grouping: false,
  width: '1%',
  render: systemScoreEntry => (
    <span>
      <Link
        href={`https://TBD/XXX/_wiki/wikis/XXX.wiki/${systemScoreEntry.id}`}
        target="_blank"
        data-id={systemScoreEntry.id}
      >
        {systemScoreEntry.title}
      </Link>
      {systemScoreEntry.isOptional ? ' (Optional)' : null}
    </span>
  ),
};
