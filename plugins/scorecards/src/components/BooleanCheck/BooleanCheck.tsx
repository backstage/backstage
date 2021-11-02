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

import React, { useState } from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Content, Page, InfoCard, GaugeCard } from '@backstage/core-components';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {
  CheckResponse,
  CheckResult,
  BooleanCheckResult,
  FactResponse,
} from '@backstage/plugin-tech-insights-common';
import ArrowDownardRounded from '@material-ui/icons/ArrowDownwardRounded';
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardOutlined from '@material-ui/icons/ArrowUpwardOutlined';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles(() => ({
  listItem: {
    display: 'flex',
    paddingLeft: '0',
    flexWrap: 'wrap',
  },
  listItemText: {
    paddingRight: '1rem',
    flex: '0 1 auto',
  },
  icon: {
    marginLeft: 'auto',
  },
}));

type Prop = {
  checkResult: CheckResult;
};

export const BooleanCheck = ({ checkResult }: Prop) => {
  const classes = useStyles();

  return (
    <ListItem className={classes.listItem}>
      <ListItemText
        primary={checkResult.check.name}
        className={classes.listItemText}
      />
      {'result' in checkResult ? (
        <CheckCircleOutline className={classes.icon} color="primary" />
      ) : (
        <ErrorOutlineIcon className={classes.icon} color="error" />
      )}
    </ListItem>
  );
};
