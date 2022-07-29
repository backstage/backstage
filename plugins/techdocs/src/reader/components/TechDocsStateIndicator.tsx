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

import { TechDocsBuildLogs } from './TechDocsBuildLogs';
import { TechDocsNotFound } from './TechDocsNotFound';
import { useTechDocsReaderPageContent } from '@backstage/plugin-techdocs-react';

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

export const TechDocsStateIndicator = () => {
  let StateAlert: JSX.Element | null = null;
  const classes = useStyles();

  const {
    state,
    contentReload,
    contentErrorMessage,
    syncErrorMessage,
    buildLog,
  } = useTechDocsReaderPageContent();

  if (state === 'INITIAL_BUILD') {
    StateAlert = (
      <Alert
        classes={{ root: classes.root }}
        variant="outlined"
        severity="info"
        icon={<CircularProgress size="24px" />}
        action={<TechDocsBuildLogs buildLog={buildLog} />}
      >
        Documentation is accessed for the first time and is being prepared. The
        subsequent loads are much faster.
      </Alert>
    );
  }

  if (state === 'CONTENT_STALE_REFRESHING') {
    StateAlert = (
      <Alert
        variant="outlined"
        severity="info"
        icon={<CircularProgress size="24px" />}
        action={<TechDocsBuildLogs buildLog={buildLog} />}
        classes={{ root: classes.root }}
      >
        A newer version of this documentation is being prepared and will be
        available shortly.
      </Alert>
    );
  }

  if (state === 'CONTENT_STALE_READY') {
    StateAlert = (
      <Alert
        variant="outlined"
        severity="success"
        action={
          <Button color="inherit" onClick={() => contentReload()}>
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

  if (state === 'CONTENT_STALE_ERROR') {
    StateAlert = (
      <Alert
        variant="outlined"
        severity="error"
        action={<TechDocsBuildLogs buildLog={buildLog} />}
        classes={{ root: classes.root, message: classes.message }}
      >
        Building a newer version of this documentation failed.{' '}
        {syncErrorMessage}
      </Alert>
    );
  }

  if (state === 'CONTENT_NOT_FOUND') {
    StateAlert = (
      <>
        {syncErrorMessage && (
          <Alert
            variant="outlined"
            severity="error"
            action={<TechDocsBuildLogs buildLog={buildLog} />}
            classes={{ root: classes.root, message: classes.message }}
          >
            Building a newer version of this documentation failed.{' '}
            {syncErrorMessage}
          </Alert>
        )}
        <TechDocsNotFound errorMessage={contentErrorMessage} />
      </>
    );
  }

  return StateAlert;
};
