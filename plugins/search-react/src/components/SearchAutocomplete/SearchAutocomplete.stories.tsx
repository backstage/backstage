/*
 * Copyright 2022 The Backstage Authors
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

import React, { ComponentType } from 'react';

import { Grid, makeStyles, Paper } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchAutocomplete } from './SearchAutocomplete';
import { SearchAutocompleteDefaultOption } from './SearchAutocompleteDefaultOption';

export default {
  title: 'Plugins/Search/SearchAutocomplete',
  component: SearchAutocomplete,
  decorators: [
    (Story: ComponentType<{}>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <Grid container direction="row">
            <Grid item xs={12}>
              <Story />
            </Grid>
          </Grid>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}));

export const Default = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />
    </Paper>
  );
};

export const Outlined = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} variant="outlined">
      <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />
    </Paper>
  );
};

export const Initialized = () => {
  const classes = useStyles();
  const options = ['hello-word', 'petstore', 'spotify'];
  return (
    <Paper className={classes.root}>
      <SearchAutocomplete options={options} value={options[0]} />
    </Paper>
  );
};

export const LoadingOptions = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <SearchAutocomplete options={[]} loading />
    </Paper>
  );
};

export const RenderingCustomOptions = () => {
  const classes = useStyles();
  const options = [
    {
      title: 'hello-world',
      text: 'Hello World example for gRPC',
    },
    {
      title: 'petstore',
      text: 'The petstore API',
    },
    {
      title: 'spotify',
      text: 'The Spotify web API',
    },
  ];

  return (
    <Paper className={classes.root}>
      <SearchAutocomplete
        options={options}
        renderOption={option => (
          <SearchAutocompleteDefaultOption
            icon={<LabelIcon titleAccess="Option icon" />}
            primaryText={option.title}
            secondaryText={option.text}
          />
        )}
      />
    </Paper>
  );
};
