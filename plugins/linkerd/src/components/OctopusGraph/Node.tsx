/*
 * Copyright 2021 Spotify AB
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
import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { humanPct } from '../../lib/percents';
import { msToHuman } from '../../lib/time';
import { MetricCounter } from './MetricCounter';

const useStyles = makeStyles({
  root: {
    width: 400,
    height: 300,
  },
  header: {
    fontSize: 20,
  },
  namespace: {
    fontSize: 20,
  },
  name: {
    fontSize: 20,
  },
  tableMetric: {
    fontWeight: 'bold',
  },
});

export const Node = memo(({ data }) => {
  const styles = useStyles();

  const subheader = () => {
    if (data.l5d) {
      return (
        <>
          <Typography className={styles.name} gutterBottom>
            {data.l5d.resource.namespace}/{data.l5d.resource.name}
          </Typography>
        </>
      );
    }

    return (
      <Typography variant="h5" component="h2" className={styles.name}>
        {data.name}
      </Typography>
    );
  };

  const table = () => {
    if (data.l5d) {
      return (
        <Card variant="outlined">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={styles.tableMetric}>RPS</TableCell>
                <TableCell align="right">
                  <MetricCounter
                    number={Math.round(data.l5d?.b7e.rps)}
                    suffix=""
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.tableMetric}>S/R</TableCell>
                <TableCell align="right">
                  <MetricCounter
                    number={Math.round(data.l5d?.b7e.successRate)}
                    suffix="%"
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={styles.tableMetric}>P99</TableCell>
                <TableCell align="right">
                  <MetricCounter
                    number={Math.round(data.l5d?.stats.latencyMsP99)}
                    lessIsMore
                    suffix="ms"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      );
    }
  };
  return (
    <>
      {data.isTarget && <Handle type="target" position="left" />}
      <Card variant="outlined" className={styles.root}>
        <CardContent>
          <Typography className={styles.header} color="textSecondary">
            {data.header} {data.l5d?.resource.type}
          </Typography>
          {subheader()}
          {table()}
        </CardContent>
      </Card>
      {data.isSource && <Handle type="source" position="right" />}
    </>
  );
});
