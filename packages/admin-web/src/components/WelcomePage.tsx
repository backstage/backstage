/*
 * Copyright 2020 The Backstage Authors
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
import { Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const WelcomePage = () => {
  const classes = useStyles();
  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <Typography variant="body1">
          The Admin tool will help you to configure your Backstage application
          very fast and easy. This tool will help you to add Github
          Authentication, Software Catalog and some other plugins to your
          Backstage.&#127881;
        </Typography>
      </Grid>
      <Grid item spacing={4}>
        <Grid container justifyContent="flex-end">
          <Button variant="contained" color="primary">
            Start
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WelcomePage;
