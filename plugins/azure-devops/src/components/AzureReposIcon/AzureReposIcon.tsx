/*
 * Copyright 2021 The Backstage Authors
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

import { makeStyles, useTheme } from '@material-ui/core';

import AzureReposSvg from '../../icons/alt-azure-repos-icon.svg';
import React from 'react';

const useStyles = makeStyles({
  darkMode: {
    filter: 'invert(100%)',
  },
  lightMode: {
    filter: 'invert(0%)',
  },
});

export const AzureReposIcon = ({
  width,
  height,
}: {
  width: string;
  height: string;
}) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <img
      src={AzureReposSvg}
      alt="Azure Repos"
      width={width}
      height={height}
      className={
        theme.palette.type.toString() === 'dark'
          ? classes.darkMode
          : classes.lightMode
      }
    />
  );
};
