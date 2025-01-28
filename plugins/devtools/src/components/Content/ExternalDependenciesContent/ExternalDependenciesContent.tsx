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

import {
  Progress,
  StatusError,
  StatusOK,
  StatusWarning,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { ExternalDependency } from '@backstage/plugin-devtools-common';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { useExternalDependencies } from '../../../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperStyle: {
      padding: theme.spacing(2),
    },
  }),
);

export const getExternalDependencyStatus = (
  result: Partial<ExternalDependency> | undefined,
) => {
  switch (result?.status) {
    case 'Healthy':
      return (
        <Typography component="span">
          <StatusOK /> {result.status}
        </Typography>
      );
    case 'Unhealthy':
      return (
        <Typography component="span">
          <StatusError /> {`${result.status}`}
        </Typography>
      );
    case undefined:
    default:
      return (
        <Typography component="span">
          <StatusWarning /> Unknown
        </Typography>
      );
  }
};

const columns: TableColumn[] = [
  {
    title: 'Name',
    width: 'auto',
    field: 'name',
  },
  {
    title: 'Target',
    width: 'auto',
    field: 'target',
  },
  {
    title: 'Type',
    width: 'auto',
    field: 'type',
  },
  {
    title: 'Status',
    width: 'auto',
    render: (row: Partial<ExternalDependency>) => (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="button">
            {getExternalDependencyStatus(row)}
          </Typography>
        </Grid>
        <Grid item>{row.error && <Typography>{row.error}</Typography>}</Grid>
      </Grid>
    ),
  },
];

/** @public */
export const ExternalDependenciesContent = () => {
  const classes = useStyles();
  const { externalDependencies, loading, error } = useExternalDependencies();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  if (!externalDependencies || externalDependencies.length === 0) {
    return (
      <Box>
        <Paper className={classes.paperStyle}>
          <Typography>No external dependencies found</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Table
      title="Status"
      options={{
        paging: true,
        pageSize: 20,
        pageSizeOptions: [20, 50, 100],
        loadingType: 'linear',
        showEmptyDataSourceMessage: !loading,
      }}
      columns={columns}
      data={externalDependencies || []}
    />
  );
};
