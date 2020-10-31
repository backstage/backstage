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
import Button from '@material-ui/core/Button';
import {
  Grid,
  Link,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    linkList: {
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);
type Props = {
  nextStep: (options?: { reset: boolean }) => void;
  PRLink: string;
};

export const ImportFinished: React.FC<Props> = ({ nextStep, PRLink }) => {
  const classes = useStyles();
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <Alert severity="success">
          Pull requests have been successfully opened. You can start again to
          import more repositories
        </Alert>
      </Grid>
      <Grid item>
        <Typography className={classes.heading}>Pull request link:</Typography>
        <Link href={PRLink}>{PRLink}</Link>
      </Grid>
      <Grid item style={{ alignSelf: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => nextStep({ reset: true })}
        >
          start again
        </Button>
      </Grid>
    </Grid>
  );
};
