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

import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
    '&:not(:first-child):not(& + &)': {
      marginTop: theme.spacing(1),
    },
  },
}));

const Ul = ({ children }: JSX.IntrinsicElements['ul']) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} component="ul">
      {children}
    </Typography>
  );
};

const Li = ({ children }: JSX.IntrinsicElements['li']) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} component="li">
      {children}
    </Typography>
  );
};

const Ol = ({ children }: JSX.IntrinsicElements['ol']) => {
  const classes = useStyles();
  return (
    <Typography className={classes.root} component="ol">
      {children}
    </Typography>
  );
};

export { Ul as ul, Li as li, Ol as ol };
