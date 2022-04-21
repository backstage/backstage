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

import React from 'react';

import { Box, makeStyles, Toolbar, ToolbarProps } from '@material-ui/core';

import {
  TechDocsAddonLocations as locations,
  useTechDocsAddons,
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
export const TechDocsReaderPageSubheader = ({
  toolbarProps,
}: {
  toolbarProps?: ToolbarProps;
}) => {
  const classes = useStyles();
  const addons = useTechDocsAddons();
  const subheaderAddons = addons.renderComponentsByLocation(
    locations.Subheader,
  );

  if (!subheaderAddons) return null;

  return (
    <Toolbar classes={classes} {...toolbarProps}>
      {subheaderAddons && (
        <Box
          display="flex"
          justifyContent="flex-end"
          width="100%"
          flexWrap="wrap"
        >
          {subheaderAddons}
        </Box>
      )}
    </Toolbar>
  );
};
