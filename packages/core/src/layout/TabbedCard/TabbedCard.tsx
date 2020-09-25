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

import React, { useState, ReactElement, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles,
  Tabs,
  Tab,
  TabProps,
} from '@material-ui/core';
import { BottomLink, BottomLinkProps } from '../BottomLink';
import { ErrorBoundary } from '../ErrorBoundary';
import { getVariantStyles } from '../InfoCard/variants';

const useTabsStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 2, 0, 2.5),
    minHeight: theme.spacing(3),
  },
  indicator: {
    backgroundColor: theme.palette.info.main,
    height: theme.spacing(0.3),
  },
  header: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
  headerTitle: {
    fontWeight: 700,
  },
  headerSubheader: {
    paddingTop: theme.spacing(1),
  },
  noPadding: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
}));

type Props = {
  slackChannel?: string;
  children?: ReactElement<TabProps>[];
  onChange?: (event: React.ChangeEvent<{}>, value: number | string) => void;
  title?: string;
  subheader?: string;
  value?: number | string;
  deepLink?: BottomLinkProps;
  variant?: string;
  noPadding?: boolean;
};

const TabbedCard = ({
  slackChannel = '#backstage',
  children,
  title,
  subheader,
  deepLink,
  value,
  onChange,
  variant,
  noPadding,
}: Props) => {
  const tabsClasses = useTabsStyles();
  const [selectedIndex, selectIndex] = useState(0);

  const handleChange = onChange
    ? onChange
    : (_ev: unknown, newSelectedIndex: number) => selectIndex(newSelectedIndex);

  let selectedTabContent: ReactNode;
  if (!value) {
    React.Children.map(children, (child, index) => {
      if (index === selectedIndex) selectedTabContent = child?.props.children;
    });
  } else {
    React.Children.map(children, child => {
      if (child?.props.value === value)
        selectedTabContent = child?.props.children;
    });
  }

  const { cardStyle, contentStyle } = getVariantStyles(variant);

  return (
    <Card style={cardStyle}>
      <ErrorBoundary slackChannel={slackChannel}>
        {title && (
          <CardHeader
            classes={{
              root: tabsClasses.header,
              title: tabsClasses.headerTitle,
              subheader: tabsClasses.headerSubheader,
            }}
            title={title}
            subheader={subheader}
          />
        )}
        <Tabs
          classes={{ root: tabsClasses.root, indicator: tabsClasses.indicator }}
          value={value || selectedIndex}
          onChange={handleChange}
        >
          {children}
        </Tabs>
        <Divider />
        <CardContent
          className={noPadding ? tabsClasses.noPadding : undefined}
          style={contentStyle}
        >
          {selectedTabContent}
        </CardContent>
        {deepLink && <BottomLink {...deepLink} />}
      </ErrorBoundary>
    </Card>
  );
};

const useCardTabStyles = makeStyles(theme => ({
  root: {
    minWidth: theme.spacing(6),
    minHeight: theme.spacing(3),
    margin: theme.spacing(0, 2, 0, 0),
    padding: theme.spacing(0.5, 0, 0.5, 0),
    textTransform: 'none',
  },
  selected: {
    fontWeight: 'bold',
  },
}));

type CardTabProps = TabProps & {
  children: ReactNode;
};

const CardTab = ({ children, ...props }: CardTabProps) => {
  const classes = useCardTabStyles();

  return <Tab disableRipple classes={classes} {...props} />;
};

export { TabbedCard, CardTab };
