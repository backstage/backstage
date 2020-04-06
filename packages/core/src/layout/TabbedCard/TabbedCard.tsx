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

import React, { FC, useState, ReactElement, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  withStyles,
  makeStyles,
  Tabs,
  Tab,
  TabProps,
} from '@material-ui/core';
import BottomLink, { Props as BottomLinkProps } from '../BottomLink';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { BackstageTheme } from '../../theme/theme';

const useTabsStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    padding: theme.spacing(0, 2, 0, 2.5),
  },
}));

const BoldHeader = withStyles(theme => ({
  root: { padding: theme.spacing(2, 2, 2, 2.5), display: 'inline-block' },
  title: { fontWeight: 700 },
  subheader: { paddingTop: theme.spacing(1) },
}))(CardHeader);

type Props = {
  slackChannel?: string;
  children?: ReactElement<TabProps>[];
  title?: string;
  value?: number | string;
  deepLink?: BottomLinkProps;
};

const TabbedCard: FC<Props> = ({
  slackChannel = '#backstage',
  children,
  title,
  deepLink,
}) => {
  const tabsClasses = useTabsStyles();
  const [selectedIndex, selectIndex] = useState(0);

  const handleChange = (_ev, newSelectedIndex) => selectIndex(newSelectedIndex);

  let selectedTabContent: ReactNode;
  React.Children.map(children, (child, index) => {
    if (index === selectedIndex) selectedTabContent = child?.props.children;
  });

  return (
    <Card>
      <ErrorBoundary slackChannel={slackChannel}>
        {title && <BoldHeader title={title} />}
        <Tabs
          classes={tabsClasses}
          value={selectedIndex}
          onChange={handleChange}
        >
          {children}
        </Tabs>
        <Divider />
        <CardContent>{selectedTabContent}</CardContent>
        {deepLink && <BottomLink {...deepLink} />}
      </ErrorBoundary>
    </Card>
  );
};

const useCardTabStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    minWidth: theme.spacing(6),
    padding: theme.spacing(1, 0, 1, 0),
    margin: theme.spacing(0, 2, 0, 0),
    textTransform: 'none',
  },
}));

type CardTabProps = TabProps & {
  children: ReactNode;
};

const CardTab: FC<CardTabProps> = ({ children, ...props }) => {
  const classes = useCardTabStyles();

  return <Tab classes={classes} {...props} />;
};

export { TabbedCard, CardTab };
