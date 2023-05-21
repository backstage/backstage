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
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Tab,
  Box,
  Tabs,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { AlertsReportsPage, StatusReportPage, IncidentsReportsPage } from '../Reports';


const useStyles = makeStyles<BackstageTheme>(theme => ({
  cards: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0, 4),
  },
  selected: {
    color: theme.palette.text.primary,
  },
  default: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  }
}));

/**
 * Component for displaying the details of a Cortex statuses.
 *
 * @public
 */
export const CortexDetailsPage = () => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    { id: 'incidents', label: 'Incidents' },
    { id: 'alerts', label: 'Alerts' }
  ];
  const safeTabIndex = tabIndex > tabs.length - 1 ? 0 : tabIndex;

  return (
    <div>
      <div>
        <StatusReportPage />
      </div>

      <Card
        style={{ position: 'relative', overflow: 'visible' }}
        className={classes.cards}
      >
        <CardContent>
          <Tabs
            indicatorColor="primary"
            onChange={(_, index) => setTabIndex(index)}
            value={safeTabIndex}
          >
            {tabs.map((tab, index) => (
              <Tab
                className={classes.default}
                label={tab.label}
                key={tab.id}
                value={index}
                classes={{ selected: classes.selected }}
              />
            ))}
          </Tabs>
          <Box ml={2} pt={2} my={1} display="flex" flexDirection="column">
            {safeTabIndex === 0 && <IncidentsReportsPage />}
            {safeTabIndex === 1 && <AlertsReportsPage />}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
