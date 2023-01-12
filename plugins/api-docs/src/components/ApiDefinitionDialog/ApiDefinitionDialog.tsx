/*
 * Copyright 2023 The Backstage Authors
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

import { ApiEntity } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
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
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { apiDocsConfigRef } from '../../config';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  fullHeightDialog: {
    height: 'calc(100% - 64px)',
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0,
  },
  tabContents: {
    flexGrow: 1,
    overflowX: 'auto',
  },
  title: {
    color: theme.palette.text.primary,
    wordBreak: 'break-word',
    fontSize: theme.typography.h3.fontSize,
    marginBottom: 0,
  },
  type: {
    textTransform: 'uppercase',
    fontSize: 11,
    opacity: 0.8,
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
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
 * A dialog that lets users inspect the API definition.
 *
 * @public
 */
export function ApiDefinitionDialog(props: {
  open: boolean;
  entity: ApiEntity;
  onClose: () => void;
}) {
  const { open, entity, onClose } = props;
  const [activeTab, setActiveTab] = React.useState(0);
  const classes = useStyles();

  useEffect(() => {
    setActiveTab(0);
  }, [open]);

  const config = useApi(apiDocsConfigRef);
  const definitionWidget = config.getApiDefinitionWidget(entity);

  let tabIndex = 0;
  let tabPanelIndex = 0;

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={onClose}
      aria-labelledby="api-definition-dialog-title"
      PaperProps={{ className: classes.fullHeightDialog }}
    >
      <DialogTitle id="api-definition-dialog-title" disableTypography>
        <Typography className={classes.type}>
          API - {definitionWidget?.title ?? 'Raw'}
        </Typography>
        <Typography className={classes.title} variant="h1">
          {entity.metadata.title ?? entity.metadata.name}
        </Typography>
      </DialogTitle>
      <DialogContent dividers className={classes.root}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          aria-label="API definition options"
          className={classes.tabs}
        >
          {definitionWidget ? (
            <Tab label={definitionWidget.title} {...a11yProps(tabIndex++)} />
          ) : null}
          <Tab label="Raw" {...a11yProps(tabIndex++)} />
        </Tabs>

        {definitionWidget ? (
          <TabPanel value={activeTab} index={tabPanelIndex++}>
            {definitionWidget.component(entity.spec.definition)}
          </TabPanel>
        ) : null}
        <TabPanel value={activeTab} index={tabPanelIndex++}>
          <PlainApiDefinitionWidget
            definition={entity.spec.definition}
            language={definitionWidget?.rawLanguage ?? entity.spec.type}
          />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
