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

import React, { useState, useCallback } from 'react';

import {
  makeStyles,
  Grid,
  Hidden,
  Drawer,
  IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import {
  useTechDocsReaderPage,
  useTechDocsReaderPageContent,
} from '@backstage/plugin-techdocs-react';

import { Provider } from './Context';
import { Sidebar } from './Sidebar';
import { Content } from './Content';
import { Toc } from './Toc';
import { Footer } from './Footer';

const useStyles = makeStyles(theme => ({
  button: {
    float: 'right',
    marginTop: -7,
    '& + *:not(:first-child)': {
      marginTop: 0,
    },
  },
  sidebar: {
    padding: theme.spacing(2),
  },
}));

/**
 * Renders TechDocs content using MDX
 * @public
 */
export const MdxReaderContent = () => {
  const classes = useStyles();
  const { entityRef, metadata } = useTechDocsReaderPage();
  const { path, content } = useTechDocsReaderPageContent();

  const [open, setOpen] = useState(false);

  const toggleDrawer = useCallback(
    (newOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(newOpen);
    },
    [setOpen],
  );

  if (!content || !metadata.value) return null;

  return (
    <Provider
      path={path}
      entityRef={entityRef}
      content={content}
      metadata={metadata.value}
    >
      <Grid container>
        <Hidden mdUp>
          <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
            <Grid className={classes.sidebar} item xs={12}>
              <Sidebar />
            </Grid>
          </Drawer>
        </Hidden>
        <Hidden smDown>
          <Grid item md={2}>
            <Sidebar />
          </Grid>
        </Hidden>
        <Grid item xs={12} md={8}>
          <Hidden mdUp>
            <IconButton
              className={classes.button}
              size="small"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Content />
        </Grid>
        <Hidden smDown>
          <Grid item md={2}>
            <Toc />
          </Grid>
        </Hidden>
        <Grid item xs={12}>
          <Footer />
        </Grid>
      </Grid>
    </Provider>
  );
};
