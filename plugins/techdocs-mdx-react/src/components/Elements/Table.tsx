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
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    border: `1px solid ${theme.palette.text.primary}`,
    borderCollapse: 'collapse',
    '& td, th': {
      border: `1px solid ${theme.palette.text.primary}`,
      padding: theme.spacing(1),
    },
  },
}));

const Table = ({ children }: JSX.IntrinsicElements['table']) => {
  const classes = useStyles();
  return <table className={classes.root}>{children}</table>;
};

export { Table as table };
