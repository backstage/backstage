/*
 * Copyright 2020 Spotify AB
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

import React, { useCallback, useState } from 'react';
import { Button, CircularProgress, Grid, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useGithubRepos } from '../util/useGithubRepos';
import { ConfigSpec } from './ImportComponentPage';
import { errorApiRef, useApi } from '@backstage/core';

type Props = {
  nextStep: () => void;
  configFile: ConfigSpec;
  savePRLink: (PRLink: string) => void;
};

const ComponentConfigDisplay: React.FC<Props> = ({
  nextStep,
  configFile,
  savePRLink,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const errorApi = useApi(errorApiRef);
  const { submitPRToRepo } = useGithubRepos();
  const onNext = useCallback(async () => {
    try {
      setSubmitting(true);
      const result = await submitPRToRepo(configFile);
      savePRLink(result.link);
      setSubmitting(false);
      nextStep();
    } catch (e) {
      setSubmitting(false);
      errorApi.post(e);
    }
  }, [submitPRToRepo, configFile, nextStep, savePRLink, errorApi]);

  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Alert severity="success">
          config file has been generated. You can optionally edit it before
          submitting Pull Request
        </Alert>
      </Grid>
      <Grid item container justify="flex-end" spacing={1}>
        <Grid item>
          <Tooltip title="Not available yet">
            <span>
              <Button variant="contained" disabled>
                Show config objects
              </Button>
            </span>
          </Tooltip>
        </Grid>
        {submitting ? (
          <Grid item>
            <CircularProgress size="2rem" />
          </Grid>
        ) : null}
        <Grid item>
          <Button
            disabled={submitting}
            variant="contained"
            color="primary"
            onClick={onNext}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ComponentConfigDisplay;
