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
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Breadcrumbs, Link } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteRef } from '@backstage/core-plugin-api';
import { puppetDbRouteRef } from '../../routes';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Tab,
  Box,
  Typography,
  Tabs,
} from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { ReportDetailsEventsTable } from './ReportDetailsEventsTable';
import { ReportDetailsLogsTable } from './ReportDetailsLogsTable';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  cards: {
    marginTop: theme.spacing(2),
  },
  tabs: {
    borderBottom: `1px solid ${theme.palette.textVerySubtle}`,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(0, 4),
  },
  default: {
    padding: theme.spacing(2),
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
  },
  selected: {
    color: theme.palette.text.primary,
  },
}));

/**
 * Component for displaying the details of a PuppetDB report.
 *
 * @public
 */
export const ReportDetailsPage = () => {
  const { hash = '' } = useParams();
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const reportsRouteLink = useRouteRef(puppetDbRouteRef);
  const tabs = [
    { id: 'events', label: 'Events' },
    { id: 'logs', label: 'Logs' },
  ];
  const safeTabIndex = tabIndex > tabs.length - 1 ? 0 : tabIndex;

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to={reportsRouteLink()}>
          PuppetDB Reports
        </Link>
        <Typography noWrap>{hash}</Typography>
      </Breadcrumbs>
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
            {safeTabIndex === 0 && <ReportDetailsEventsTable hash={hash} />}
            {safeTabIndex === 1 && <ReportDetailsLogsTable hash={hash} />}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
