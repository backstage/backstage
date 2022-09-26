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
import { Grid, Tab, Tabs, makeStyles } from '@material-ui/core';
import { newRelicDashboardApiRef } from '../../../api';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { Progress, ErrorPanel } from '@backstage/core-components';
import { DashboardSnapshot } from './DashboardSnapshot';
import { DashboardEntitySummary } from '../../../api/NewRelicDashboardApi';
import { ResultEntity } from '../../../types/DashboardEntity';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value1: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value1, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value1 !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(
  theme => ({
    tabsWrapper: {
      gridArea: 'pageSubheader',
      backgroundColor: theme.palette.background.paper,
      paddingLeft: theme.spacing(3),
    },
    defaultTab: {
      padding: theme.spacing(3, 3),
      ...theme.typography.caption,
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: theme.palette.text.secondary,
    },
    selected: {
      color: theme.palette.text.primary,
    },
    tabRoot: {
      '&:hover': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    },
  }),
  { name: 'DashboardHeaderTabs' },
);

export const DashboardSnapshotList = (props: { guid: string }) => {
  const { guid } = props;
  const styles = useStyles();
  const newRelicDashboardAPI = useApi(newRelicDashboardApiRef);
  const { value, loading, error } = useAsync(async (): Promise<
    DashboardEntitySummary | undefined
  > => {
    const dashboardObject: Promise<DashboardEntitySummary | undefined> =
      newRelicDashboardAPI.getDashboardEntity(guid);
    return dashboardObject;
  }, [guid]);
  const [value1, setValue1] = useState<number>(0);
  const handleChange = ({}: React.ChangeEvent<{}>, newValue: number) => {
    setValue1(newValue);
  };

  if (loading) {
    return <Progress />;
  }
  if (error) {
    return <ErrorPanel title={error.name} defaultExpanded error={error} />;
  }
  return (
    <Grid container direction="column">
      <Tabs
        selectionFollowsFocus
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        onChange={handleChange}
        value={value1}
        style={{ width: '100%' }}
      >
        {value?.getDashboardEntity?.data?.actor.entitySearch.results.entities?.map(
          (Entity: ResultEntity, index: number) => {
            return (
              <Tab
                label={Entity.name}
                className={styles.defaultTab}
                classes={{
                  selected: styles.selected,
                  root: styles.tabRoot,
                }}
                {...a11yProps(index)}
              />
            );
          },
        )}
      </Tabs>
      {value?.getDashboardEntity?.data?.actor.entitySearch.results.entities?.map(
        (Entity: ResultEntity, index: number) => {
          return (
            <TabPanel value1={value1} index={index}>
              <DashboardSnapshot
                name={Entity.name}
                permalink={Entity.permalink}
                guid={Entity.guid}
              />
            </TabPanel>
          );
        },
      )}
    </Grid>
  );
};
