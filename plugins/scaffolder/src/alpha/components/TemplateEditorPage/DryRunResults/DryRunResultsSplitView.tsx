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

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import React, { Children, ReactNode } from 'react';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '280px auto 3fr',
    gridTemplateRows: '1fr',
  },
  child: {
    overflowY: 'auto',
    height: '100%',
    minHeight: 0,
  },
  firstChild: {
    background: theme.palette.background.paper,
  },
}));

export function DryRunResultsSplitView(props: { children: ReactNode }) {
  const classes = useStyles();
  const childArray = Children.toArray(props.children);

  if (childArray.length !== 2) {
    throw new Error('must have exactly 2 children');
  }

  return (
    <div className={classes.root}>
      <div className={classNames(classes.child, classes.firstChild)}>
        {childArray[0]}
      </div>
      <Divider orientation="horizontal" />
      <div className={classes.child}>{childArray[1]}</div>
    </div>
  );
}
