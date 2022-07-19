/*
 * Copyright 2022 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Tab,
  Tabs,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { AncestryPage } from './components/AncestryPage';
import { ColocatedPage } from './components/ColocatedPage';
import { JsonPage } from './components/JsonPage';
import { OverviewPage } from './components/OverviewPage';
import { YamlPage } from './components/YamlPage';

const useStyles = makeStyles(theme => ({
  fullHeightDialog: {
    height: 'calc(100% - 64px)',
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  tabContents: {
    flexGrow: 1,
    overflowX: 'auto',
  },
}));

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className={classes.tabContents}
      {...other}
    >
      {value === index && (
        <Box pl={3} pr={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

/**
 * A dialog that lets users inspect the low level details of their entities.
 *
 * @public
 */
export function InspectEntityDialog(props: {
  open: boolean;
  entity: Entity;
  onClose: () => void;
}) {
  const classes = useStyles();
  const [activeTab, setActiveTab] = React.useState(0);

  useEffect(() => {
    setActiveTab(0);
  }, [props.open]);

  if (!props.entity) {
    return null;
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="entity-inspector-dialog-title"
      PaperProps={{ className: classes.fullHeightDialog }}
    >
      <DialogTitle id="entity-inspector-dialog-title">
        Entity Inspector
      </DialogTitle>
      <DialogContent dividers>
        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="Inspector options"
            className={classes.tabs}
          >
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Ancestry" {...a11yProps(1)} />
            <Tab label="Colocated" {...a11yProps(2)} />
            <Tab label="Raw JSON" {...a11yProps(3)} />
            <Tab label="Raw YAML" {...a11yProps(4)} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <OverviewPage entity={props.entity} />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <AncestryPage entity={props.entity} />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <ColocatedPage entity={props.entity} />
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <JsonPage entity={props.entity} />
          </TabPanel>
          <TabPanel value={activeTab} index={4}>
            <YamlPage entity={props.entity} />
          </TabPanel>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
