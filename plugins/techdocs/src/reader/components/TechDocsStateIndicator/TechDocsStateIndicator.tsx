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

import React from 'react';

import { CircularProgress, Button, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { Progress } from '@backstage/core-components';

import { TechDocsBuildLogs } from '../TechDocsBuildLogs';
import { useTechDocsReader } from '../Reader';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  message: {
    // `word-break: break-word` is deprecated, but gives legacy support to browsers not supporting `overflow-wrap` yet
    // https://developer.mozilla.org/en-US/docs/Web/CSS/word-break
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  },
}));

/**
 * Note: this component is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this component will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const TechDocsStateIndicator = () => {
  const classes = useStyles();

  const { status, contentReload, syncBuildLog, syncErrorMessage } =
    useTechDocsReader();

  if (status === 'CHECKING') {
    return <Progress />;
  }

  if (status === 'INITIAL_BUILD') {
    return (
      <Alert
        classes={{ root: classes.root }}
        variant="outlined"
        severity="info"
        icon={<CircularProgress size="24px" />}
        action={<TechDocsBuildLogs buildLog={syncBuildLog} />}
      >
        Documentation is accessed for the first time and is being prepared. The
        subsequent loads are much faster.
      </Alert>
    );
  }

  if (status === 'CONTENT_STALE_REFRESHING') {
    return (
      <Alert
        variant="outlined"
        severity="info"
        icon={<CircularProgress size="24px" />}
        action={<TechDocsBuildLogs buildLog={syncBuildLog} />}
        classes={{ root: classes.root }}
      >
        A newer version of this documentation is being prepared and will be
        available shortly.
      </Alert>
    );
  }

  if (status === 'CONTENT_STALE_READY') {
    return (
      <Alert
        variant="outlined"
        severity="success"
        action={
          <Button color="inherit" onClick={contentReload}>
            Refresh
          </Button>
        }
        classes={{ root: classes.root }}
      >
        A newer version of this documentation is now available, please refresh
        to view.
      </Alert>
    );
  }

  if (status === 'CONTENT_STALE_ERROR') {
    return (
      <Alert
        variant="outlined"
        severity="error"
        action={<TechDocsBuildLogs buildLog={syncBuildLog} />}
        classes={{ root: classes.root, message: classes.message }}
      >
        Building a newer version of this documentation failed.{' '}
        {syncErrorMessage}
      </Alert>
    );
  }

  return null;
};
