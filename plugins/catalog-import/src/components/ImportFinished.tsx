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

import React from 'react';
import { Alert } from '@material-ui/lab';
import { Button, Grid, Link } from '@material-ui/core';

type Props = {
  type: 'tree' | 'file';
  nextStep: (options?: { reset: boolean }) => void;
  PRLink: string;
};

export const ImportFinished = ({ nextStep, PRLink, type }: Props) => {
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Alert severity="success">
          {type === 'tree'
            ? 'Pull requests have been successfully opened. You can start again to import more repositories'
            : 'Entity added to catalog successfully'}
        </Alert>
      </Grid>
      <Grid item>
        {type === 'tree' ? (
          <Link
            href={PRLink}
            style={{ marginRight: '8px' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            View pull request on GitHub
          </Link>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          onClick={() => nextStep({ reset: true })}
        >
          Register another
        </Button>
      </Grid>
    </Grid>
  );
};
