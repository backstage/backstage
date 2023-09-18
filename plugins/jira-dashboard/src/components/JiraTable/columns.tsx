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
import { Link, TableColumn } from '@backstage/core-components';
import { Issue } from '@backstage/plugin-jira-dashboard-common';
import { Typography } from '@material-ui/core';
import { getIssueUrl } from '../../lib';

export const columns: TableColumn[] = [
  {
    title: 'Key',
    field: 'key',
    highlight: true,
    type: 'string',
    width: '30%',

    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          <img
            src={issue.fields?.issuetype.iconUrl}
            alt={issue.fields?.issuetype.name}
            style={{ paddingRight: '15px' }}
          />
          {issue.key}
        </Link>
      );
    },
  },
  {
    title: 'Summary',
    field: 'fields.summary',
    highlight: true,
    type: 'string',
    width: '50%',
    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          style={{ lineHeight: 1.5 }}
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          {issue.fields?.summary}
        </Link>
      );
    },
  },
  {
    title: 'Status',
    field: 'fields.status.name',
    highlight: true,
    type: 'string',
    width: '30%',

    render: (issue: Partial<Issue>) => {
      if (!issue.self || !issue.key) {
        return null;
      }
      return (
        <Link
          to={getIssueUrl(issue.self, issue.key)}
          title="Go to issue in Jira"
        >
          {issue.fields?.status.name}
        </Link>
      );
    },
  },
  {
    title: 'Assignee',
    field: 'fields.assignee.name',
    highlight: true,
    type: 'string',
    width: '10%',

    render: (issue: Partial<Issue>) => {
      if (!issue.fields?.assignee)
        return <Typography style={{ color: 'grey' }}>Unassigned</Typography>;
      return <>{issue.fields?.assignee.name.split('@')[0]}</>;
    },
  },
];
