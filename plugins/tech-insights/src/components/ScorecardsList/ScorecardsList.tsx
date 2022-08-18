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
import { useApi } from '@backstage/core-plugin-api';
import { makeStyles, List, ListItem, ListItemText } from '@material-ui/core';
import { techInsightsApiRef } from '../../api/TechInsightsApi';
import { CheckResult } from '@backstage/plugin-tech-insights-common';
import { BackstageTheme } from '@backstage/theme';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme: BackstageTheme) => ({
  listItemText: {
    paddingRight: theme.spacing(0.5),
  },
}));

export const ScorecardsList = (props: { checkResults: CheckResult[] }) => {
  const { checkResults } = props;
  const classes = useStyles();
  const api = useApi(techInsightsApiRef);

  const types = [...new Set(checkResults.map(({ check }) => check.type))];
  const checkResultRenderers = api.getCheckResultRenderers(types);

  return (
    <List>
      {checkResults.map((result, index) => (
        <ListItem key={result.check.id}>
          <ListItemText
            key={index}
            primary={result.check.name}
            secondary={result.check.description}
            className={classes.listItemText}
          />
          {checkResultRenderers
            .find(({ type }) => type === result.check.type)
            ?.component(result) ?? (
            <Alert severity="error">Unknown type.</Alert>
          )}
        </ListItem>
      ))}
    </List>
  );
};
