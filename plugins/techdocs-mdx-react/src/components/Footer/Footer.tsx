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
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { makeStyles, Box, Button, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useProvider } from '../Context';
import { TechDocsNav } from '../types';
import { useTechDocsRoute } from '../hooks';

const useStyles = makeStyles(theme => ({
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    textTransform: 'capitalize',
    padding: 0,
    backgroundColor: theme.palette.background.default,
    '&:hover': {
      cursor: 'pointer',
      opacity: '.7',
      backgroundColor: theme.palette.background.default,
    },
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
      bottom: theme.spacing(2),
      maxWidth: `calc(20% - ${theme.spacing(2)}px)`,
    },
  },
  buttonNext: {
    [theme.breakpoints.up('md')]: {
      right: theme.spacing(3),
    },
  },
}));

type Pages = { title: string; path: string }[];

const getPages = (items: TechDocsNav, pages: Pages = []): Pages => {
  for (const item of items) {
    const [[key, value]] = Object.entries(item);
    if (typeof value === 'string') {
      pages.push({
        title: key.split('/').pop()!,
        path: value.replace('.md', ''),
      });
    } else {
      getPages(value, pages);
    }
  }
  return pages;
};

export const Footer = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { path, metadata } = useProvider();
  const techdocsRoute = useTechDocsRoute();

  const items = metadata?.nav;

  if (!items) return null;

  const pages = getPages(items);

  const currentPath = path || 'index';
  const currentPage = pages.find(page => page.path === currentPath);
  const currentIndex = pages.indexOf(currentPage!);

  const lastIndex = pages.length - 1;
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < lastIndex ? pages[currentIndex + 1] : null;

  return (
    <footer className={classes.footer}>
      {prevPage && (
        <Button
          className={classes.button}
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            const prevPath = prevPage.path;
            navigate(techdocsRoute(prevPath === 'index' ? '' : `/${prevPath}`));
          }}
          disableRipple
        >
          <Box
            component="span"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Typography variant="caption" color="textSecondary">
              Previous
            </Typography>
            {prevPage.title}
          </Box>
        </Button>
      )}
      {nextPage ? (
        <Button
          className={clsx(classes.button, classes.buttonNext)}
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            const nextPath = nextPage.path;
            navigate(techdocsRoute(nextPath === 'index' ? '' : `/${nextPath}`));
          }}
          disableRipple
        >
          <Box
            component="span"
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Typography variant="caption" color="textSecondary">
              Next
            </Typography>
            {nextPage.title}
          </Box>
        </Button>
      ) : null}
    </footer>
  );
};
