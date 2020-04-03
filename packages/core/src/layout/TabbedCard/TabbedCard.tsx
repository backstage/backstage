/*
 * Copyright 2020 Spotify AB
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

import React, { FC, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  withStyles,
  makeStyles,
  Tabs,
  Tab,
} from '@material-ui/core';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { BackstageTheme } from '../../theme/theme';

const BoldHeader = withStyles(theme => ({
  title: { fontWeight: 700 },
  subheader: { paddingTop: theme.spacing(1) },
}))(CardHeader);

type Props = {
  slackChannel?: string;
  children?: ReactNode;
};

const TabbedCard: FC<Props> = ({ slackChannel = '#backstage', children }) => {
  return (
    <Card>
      <ErrorBoundary slackChannel={slackChannel}>{children}</ErrorBoundary>
    </Card>
  );
};

type CardTabProps = {
  label: string;
  value?: any;
};

const CardTab: FC<CardTabProps> = ({ ...props }) => {
  return <Tab {...props} />;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  header: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
}));

type CardTabsProps = {
  children: ReactNode;
  value: any;
  title: string;
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
};

const CardTabs: FC<CardTabsProps> = ({ children, value, title, onChange }) => {
  const classes = useStyles();

  return (
    <>
      <BoldHeader className={classes.header} title={title} />
      <Tabs value={value} onChange={onChange}>
        {children}
      </Tabs>
      <Divider />
    </>
  );
};

type CardTabPanelProps = {
  children: ReactNode;
  value: number;
  index: number;
};

const CardTabPanel: FC<CardTabPanelProps> = ({ children, value, index }) => {
  return (
    <CardContent
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
    >
      {children}
    </CardContent>
  );
};

export { TabbedCard, CardTabPanel, CardTabs, CardTab };
