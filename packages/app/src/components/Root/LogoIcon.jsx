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
// @ts-check
// NOTE: This file is intentionally .jsx, so that there is one file in this repo where we make sure .jsx files work.

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  svg: {
    width: 'auto',
    height: 42,
  },
  path: {
    fill: '#7df3e1',
  },
});

const LogoIcon = () => {
  const classes = useStyles();

  return (
    <img
      className={classes.svg}
      src="https://raw.githubusercontent.com/lmhinnel/nyancat-svg/refs/heads/lmhinnel/nyancat-transparent.svg"
      alt="logo-icon"
    />
  );
};

export default LogoIcon;
