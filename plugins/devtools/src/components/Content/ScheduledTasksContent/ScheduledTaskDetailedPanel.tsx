/*
 * Copyright 2025 The Backstage Authors
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
import { TaskApiTasksResponse } from '@backstage/plugin-devtools-common';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detailPanel: {
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    detailLabel: {
      fontWeight: 'bold',
      marginRight: theme.spacing(1),
    },
    errorIcon: {
      color: theme.palette.error.main,
      marginRight: theme.spacing(1),
      fontSize: '1.2rem',
    },
    detailPanelAlert: {
      marginBottom: theme.spacing(2),
    },
  }),
);

/** @public */
export const ScheduledTaskDetailPanel = ({
  rowData,
}: {
  rowData: TaskApiTasksResponse;
}) => {
  const classes = useStyles();
  const lastRunError = rowData.taskState?.lastRunError;

  const DetailItem = ({ title, value }: { title: string; value: any }) => (
    <>
      <Grid item xs={3}>
        <Typography variant="subtitle2" className={classes.detailLabel}>
          {title}:
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="body2" component="code">
          {value || 'N/A'}
        </Typography>
      </Grid>
    </>
  );

  return (
    <Box className={classes.detailPanel}>
      {lastRunError && (
        <Alert severity="error" className={classes.detailPanelAlert}>
          <strong>Last Run Error:</strong> {lastRunError}
        </Alert>
      )}

      <Grid container spacing={1}>
        <DetailItem title="Worker State" value={rowData.workerState?.status} />
        <DetailItem
          title="Frequency (Cadence)"
          value={rowData.settings?.cadence?.toString()}
        />
        <DetailItem title="Scope" value={rowData.scope} />
        <DetailItem
          title="Started At"
          value={
            rowData.taskState?.status === 'running' &&
            rowData.taskState.startedAt
              ? new Date(rowData.taskState.startedAt).toLocaleString()
              : 'N/A'
          }
        />
        <DetailItem
          title="Times Out At"
          value={
            rowData.taskState?.status === 'running' &&
            rowData.taskState.timesOutAt
              ? new Date(rowData.taskState.timesOutAt).toLocaleString()
              : 'N/A'
          }
        />
      </Grid>
    </Box>
  );
};
