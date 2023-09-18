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
import { Typography, makeStyles } from '@material-ui/core';
import { JiraDataResponse } from '@backstage/plugin-jira-dashboard-common';
import { ErrorPanel, Table } from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

type Props = {
  tableContent: JiraDataResponse;
};

const useStyles = makeStyles(theme => ({
  root: {
    colorScheme: theme.palette.type,
  },
}));

export const JiraTable = ({ tableContent }: Props) => {
  const classes = useStyles();

  if (!tableContent) {
    return <ErrorPanel error={Error('Table could not be rendered')} />;
  }
  const nbrOfIssues = tableContent?.issues?.length ?? 0;

  return (
    <div className={classes.root}>
      <Table
        title={`${capitalize(tableContent.name)} (${nbrOfIssues})`}
        options={{
          paging: false,
          padding: 'dense',
          search: true,
        }}
        data={tableContent.issues || []}
        columns={columns}
        emptyContent={
          <Typography
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: 30,
            }}
          >
            No issues found&nbsp;
          </Typography>
        }
        style={{
          height: '500px',
          padding: '20px',
          overflowY: 'scroll',
          width: '100%',
        }}
      />
    </div>
  );
};
