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

import React, { FC, useRef, useEffect, MutableRefObject } from 'react';
import { BackstageTheme } from '@backstage/theme';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { chunkArray, useWindowWidth } from './utils';

/* Import Components */

import TabPanel from './TabPanel';
import TabIcon from './TabIcon';
import Tab from './Tab';
import TabBar from './TabBar';

/* Props Types */

interface TabProps {
  label: string;
  content: any;
}

export interface TabsProps {
  tabs: TabProps[];
}

const useStyles = makeStyles<BackstageTheme>((theme: BackstageTheme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  styledTabs: {
    backgroundColor: theme.palette.tabbar.background,
  },
  appbar: {
    boxShadow: 'none',
    backgroundColor: theme.palette.tabbar.background,
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

const Tabs: FC<TabsProps> = ({ tabs }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [navIndex, setNavIndex] = React.useState(0);
  const [chunkedTabs, setChunkedTabs] = React.useState([[]] as TabProps[][]);
  const wrapper = useRef() as MutableRefObject<HTMLDivElement>;

  const size = useWindowWidth();

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const navigateToPrevChunk = () => {
    setValue(navIndex - 1 === 0 ? 0 : 1);
    setNavIndex(navIndex - 1);
  };

  const navigateToNextChunk = () => {
    setValue(1);
    setNavIndex(navIndex + 1);
  };

  const hasNextNavIndex = () => navIndex + 1 < chunkedTabs.length;

  useEffect(() => {
    // Each time the window is resized we calculate how many tabs wwe can render given the window width
    const padding = 20; // The AppBar padding

    const numberOfTabIcons = navIndex === 0 ? 1 : 2;
    const wrapperWidth =
      wrapper.current.offsetWidth - padding - numberOfTabIcons * 30;

    const numberOfChunkedElement = Math.floor(wrapperWidth / 170);
    setChunkedTabs(
      chunkArray([...tabs], numberOfChunkedElement) as TabProps[][],
    );
  }, [size]);

  return (
    <div className={classes.root}>
      <AppBar ref={wrapper} className={classes.appbar} position="static">
        <div className={classes.root2}>
          <TabBar value={value} onChange={handleChange}>
            {navIndex !== 0 && (
              <TabIcon
                onClick={navigateToPrevChunk}
                ariaLabel="navigate-before"
              >
                <NavigateBeforeIcon />
              </TabIcon>
            )}
            {chunkedTabs[navIndex].map((tab, index) => (
              <Tab
                isFirstIndex={index === 0}
                isFirstNav={navIndex === 0}
                key={index}
                label={tab.label}
              />
            ))}
            {hasNextNavIndex() && (
              <TabIcon
                isNext
                onClick={navigateToNextChunk}
                ariaLabel="navigate-next"
              >
                <NavigateNextIcon />
              </TabIcon>
            )}
          </TabBar>
        </div>
      </AppBar>
      {chunkedTabs[navIndex].map((tab, index) => (
        <TabPanel
          key={index}
          // Used to prevent issues with TabIcon inside the TabBar
          value={navIndex === 0 ? value : value - 1}
          index={index}
        >
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};

export default Tabs;
