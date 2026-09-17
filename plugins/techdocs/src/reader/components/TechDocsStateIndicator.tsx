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

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { TechDocsBuildLogs } from './TechDocsBuildLogs';
import { TechDocsNotFound } from './TechDocsNotFound';
import { useTechDocsReader } from './TechDocsReaderProvider';
import { techdocsTranslationRef } from '../../translation';

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
  const { t } = useTranslationRef(techdocsTranslationRef);

  const {
    state,
    contentReload,
    contentErrorMessage,
    syncErrorMessage,
    buildLog,
  } = useTechDocsReader();

  if (state === 'INITIAL_BUILD') {
    StateAlert = (
      <Alert
        classes={{ root: classes.root }}
        variant="outlined"
        severity="info"
        icon={<CircularProgress size="24px" />}
        action={<TechDocsBuildLogs buildLog={buildLog} />}
      >
        {t('stateIndicator.initialBuild.message')}
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
        {t('stateIndicator.contentStaleRefreshing.message')}
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
            {t('stateIndicator.contentStaleReady.refreshButton')}
          </Button>
        }
        classes={{ root: classes.root }}
      >
        {t('stateIndicator.contentStaleReady.message')}
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
        {t('stateIndicator.contentStaleError.message')} {syncErrorMessage}
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
            {t('stateIndicator.contentStaleError.message')} {syncErrorMessage}
          </Alert>
        )}
        <TechDocsNotFound errorMessage={contentErrorMessage} />
      </>
    );
  }

  return StateAlert;
};
