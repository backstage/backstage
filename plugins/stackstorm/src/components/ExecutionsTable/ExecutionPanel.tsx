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
import {
  CodeSnippet,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { Execution, stackstormApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Status } from './Status';

const useStyles = makeStyles(theme => ({
  table: {
    maxWidth: '50%',
    flex: 'i',
  },
  title: {
    paddingTop: theme.spacing(2),
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  card: {
    borderBottom: `2px solid ${theme.palette.divider}`,
  },
}));

const THead = withStyles(() => ({
  root: {
    paddingLeft: 0,
  },
}))(TableCell);

const TRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}))(TableRow);

const ExecutionCard = ({ e }: { e: Execution }) => {
  const st2 = useApi(stackstormApiRef);
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Table className={classes.table} size="small">
          <TableBody>
            <TRow>
              <THead component="th" scope="row">
                Name
              </THead>
              <TableCell>{e.action.ref}</TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Status
              </THead>
              <TableCell>
                <Status status={e.status} />
              </TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Execution ID
              </THead>
              <TableCell>{e.id}</TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Started
              </THead>
              <TableCell>{new Date(e.start_timestamp).toUTCString()}</TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Finished
              </THead>
              <TableCell>{new Date(e.end_timestamp).toUTCString()}</TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Execution Time
              </THead>
              <TableCell>{Math.round(e.elapsed_seconds)} s</TableCell>
            </TRow>
            <TRow>
              <THead component="th" scope="row">
                Runner
              </THead>
              <TableCell>{e.action.runner_type}</TableCell>
            </TRow>
          </TableBody>
        </Table>
        <Typography className={classes.title} gutterBottom>
          Action Output
        </Typography>
        <CodeSnippet
          text={JSON.stringify(e.result, null, 2)}
          language="json"
          customStyle={{ width: 800 }}
        />
        <Typography className={classes.title} gutterBottom>
          Action Input
        </Typography>
        <CodeSnippet
          text={JSON.stringify(e.parameters, null, 2)}
          language="json"
          customStyle={{ width: 800 }}
        />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          href={`${st2.getExecutionHistoryUrl(e.id)}`}
          target="_blank"
        >
          View in ST2
        </Button>
      </CardActions>
    </Card>
  );
};

export const ExecutionPanel = ({ id }: { id: string }) => {
  const st2 = useApi(stackstormApiRef);

  const { value, loading, error } = useAsync(async (): Promise<Execution> => {
    const data = await st2.getExecution(id);
    return data;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <ExecutionCard e={value!} />;
};
