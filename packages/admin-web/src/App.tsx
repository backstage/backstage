/*
 * Copyright 2023 The Backstage Authors
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
import React, { useState } from 'react';
import WelcomePage from './components/WelcomePage';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import Bar from './components/Bar';
import StepperPage from './components/StepperPage';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: '100%',
  },
  content: {
    padding: '10px',
  },
  item: {
    flexBasis: '100%',
    width: '50%',
  },
}));

const App = () => {
  const classes = useStyles();
  const [page, setPage] = useState('welcome');

  const getContent = () => {
    switch (page) {
      case 'stepper':
        return <StepperPage />;
      default:
        return <WelcomePage setPage={setPage} />;
    }
  };
  const Content = () => {
    return (
      <Paper elevation={4} className={classes.content}>
        {getContent()}
      </Paper>
    );
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className={classes.root}
    >
      <Grid item className={classes.item}>
        <Bar />
        <Content />
      </Grid>
    </Grid>
  );
};

export default App;
