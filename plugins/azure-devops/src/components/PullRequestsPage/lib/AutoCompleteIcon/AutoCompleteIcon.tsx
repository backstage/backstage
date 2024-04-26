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

import DoneAllIcon from '@material-ui/icons/DoneAll';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: (props: { hasAutoComplete: boolean }) => ({
    color: props.hasAutoComplete
      ? theme.palette.success.main
      : theme.palette.grey[400],
  }),
}));

export const AutoCompleteIcon = (props: { hasAutoComplete: boolean }) => {
  const classes = useStyles(props);
  return <DoneAllIcon className={classes.root} />;
};
