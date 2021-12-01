/*
 * Copyright 2021 The Backstage Authors
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

import { Progress } from '@backstage/core-components';
import {
  Button,
  createStyles,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import React, { Suspense, useState } from 'react';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '75%',
      },
      [theme.breakpoints.up('md')]: {
        width: '50%',
      },
      padding: theme.spacing(2.5),
    },
    root: {
      height: '100%',
      overflow: 'hidden',
    },
  }),
);

export const TechDocsBuildLogsDrawerContent = ({
  buildLog,
  onClose,
}: {
  buildLog: string[];
  onClose: () => void;
}) => {
  const classes = useDrawerStyles();
  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      spacing={0}
      wrap="nowrap"
    >
      <Grid
        item
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
        wrap="nowrap"
      >
        <Typography variant="h5">Build Details</Typography>
        <IconButton
          key="dismiss"
          title="Close the drawer"
          onClick={onClose}
          color="inherit"
        >
          <Close />
        </IconButton>
      </Grid>

      <Suspense fallback={<Progress />}>
        <LazyLog
          text={
            buildLog.length === 0 ? 'Waiting for logs...' : buildLog.join('\n')
          }
          extraLines={1}
          follow
          selectableLines
          enableSearch
        />
      </Suspense>
    </Grid>
  );
};

export const TechDocsBuildLogs = ({ buildLog }: { buildLog: string[] }) => {
  const classes = useDrawerStyles();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="inherit" onClick={() => setOpen(true)}>
        Show Build Logs
      </Button>
      <Drawer
        classes={{ paper: classes.paper }}
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <TechDocsBuildLogsDrawerContent
          buildLog={buildLog}
          onClose={() => setOpen(false)}
        />
      </Drawer>
    </>
  );
};
