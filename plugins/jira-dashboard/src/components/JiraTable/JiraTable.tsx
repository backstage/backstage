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
import { makeStyles } from '@material-ui/core';
import { JiraDataResponse } from '../../types';
import { Table } from '@backstage/core-components';
import { capitalize } from 'lodash';
import { columns } from './columns';

type Props = {
  value: JiraDataResponse;
};

const useStyles = makeStyles(theme => ({
  root: {
    colorScheme: theme.palette.type,
  },
  empty: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export const JiraTable = (props: Props) => {
  const { name, issues } = props.value;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Table
        title={`${capitalize(name)} (${issues.length})`}
        options={{
          paging: false,
          padding: 'dense',
          search: true,
        }}
        data={issues}
        columns={columns}
        emptyContent={
          <div className={classes.empty}>No issues found&nbsp;</div>
        }
        style={{
          height: '412px',
          padding: '20px',
          overflowY: 'scroll',
          width: '100%',
        }}
      />
    </div>
  );
};
