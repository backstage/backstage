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
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  IconButton,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';

import { SettingsModal } from '../components';

const useStyles = makeStyles((theme: Theme) => ({
  settingsIconButton: {
    padding: theme.spacing(0, 1, 0, 0),
  },
}));

export const ComponentAccordion = ({
  title,
  Content,
  Actions,
  Settings,
  ContextProvider,
  ...childProps
}: {
  title: string;
  Content: () => JSX.Element;
  Actions?: () => JSX.Element;
  Settings?: () => JSX.Element;
  ContextProvider?: (props: any) => JSX.Element;
}) => {
  const classes = useStyles();
  const [settingsIsExpanded, setSettingsIsExpanded] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleOpenSettings = (e: any) => {
    e.stopPropagation();
    setSettingsIsExpanded(prevState => !prevState);
  };

  const innerContent = (
    <>
      {Settings && (
        <SettingsModal
          open={settingsIsExpanded}
          close={() => setSettingsIsExpanded(false)}
          componentName={title}
        >
          <Settings />
        </SettingsModal>
      )}
      <Accordion
        expanded={isExpanded}
        onChange={(_e: any, expanded: boolean) => setIsExpanded(expanded)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {Settings && (
            <IconButton
              onClick={handleOpenSettings}
              className={classes.settingsIconButton}
            >
              <SettingsIcon />
            </IconButton>
          )}
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <Content />
            {Actions && <Actions />}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );

  return ContextProvider ? (
    <ContextProvider {...childProps}>{innerContent}</ContextProvider>
  ) : (
    innerContent
  );
};
