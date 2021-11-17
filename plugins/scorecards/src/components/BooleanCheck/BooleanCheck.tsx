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

import React from 'react';
import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { CheckResult } from '@backstage/plugin-tech-insights-common';

const useStyles = makeStyles(() => ({
  listItemText: {
    paddingRight: '1rem',
    flex: '0 1 auto',
  },
  icon: {
    marginLeft: 'auto',
  },
}));

type Prop = {
  checkResult: CheckResult[];
};

const renderResult = (classes: any, result: Boolean) => {
  return result ? (
    <CheckCircleOutline className={classes.icon} color="primary" />
  ) : (
    <ErrorOutlineIcon className={classes.icon} color="error" />
  );
};

export const BooleanCheck = ({ checkResult }: Prop) => {
  const classes = useStyles();

  return (
    <List>
      {checkResult!.map(check => (
        <ListItem>
          <ListItemText
            primary={check.check.name}
            secondary={check.check.description}
            className={classes.listItemText}
          />
          {renderResult(classes, check.result)}
        </ListItem>
      ))}
    </List>
  );
};
