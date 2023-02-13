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
import React from 'react';
import { Breadcrumbs, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: '16px',
    textDecoration: 'underline',
  },
});

const Breadcrumb = () => {
  const classes = useStyles();
  return (
    <Breadcrumbs aria-label="breadcrumb" className={classes.root}>
      <Link color="inherit" href="/">
        WelcomePage
      </Link>
    </Breadcrumbs>
  );
};

export default Breadcrumb;
