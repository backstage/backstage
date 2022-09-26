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

import React, { MouseEvent, useState, useCallback } from 'react';

import {
  Box,
  makeStyles,
  Toolbar,
  ToolbarProps,
  Menu,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';

const useStyles = makeStyles(theme => ({
  root: {
    gridArea: 'pageSubheader',
    flexDirection: 'column',
    minHeight: 'auto',
    padding: theme.spacing(3, 3, 0),
  },
}));

/**
 * Renders the reader page subheader.
 * Please use the Tech Docs add-ons to customize it
 * @public
 */
export const TechDocsReaderPageSubheader = (props: {
  toolbarProps?: ToolbarProps;
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const {
    entityMetadata: { value: entityMetadata, loading: entityMetadataLoading },
  } = useTechDocsReaderPage();

  const addons = useTechDocsAddons();

  const subheaderAddons = addons.renderComponentsByLocation(
    locations.Subheader,
  );

  const settingsAddons = addons.renderComponentsByLocation(locations.Settings);

  if (!subheaderAddons && !settingsAddons) return null;

  // No entity metadata = 404. Don't render subheader on 404.
  if (entityMetadataLoading === false && !entityMetadata) return null;

  return (
    <Toolbar classes={classes} {...props.toolbarProps}>
      <Box
        display="flex"
        justifyContent="flex-end"
        width="100%"
        flexWrap="wrap"
      >
        {subheaderAddons}
        {settingsAddons ? (
          <>
            <Tooltip title="Settings">
              <IconButton
                aria-controls="tech-docs-reader-page-settings"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="tech-docs-reader-page-settings"
              getContentAnchorEl={null}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              keepMounted
            >
              {settingsAddons}
            </Menu>
          </>
        ) : null}
      </Box>
    </Toolbar>
  );
};
