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
import Snackbar from '@material-ui/core/Snackbar';
import classNames from 'classnames';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { DateTime } from 'luxon';

type BannerProps = {
  startTime: DateTime;
  endTime: DateTime;
  info: string;
};
const useStyles = makeStyles(
  (theme: BackstageTheme) => ({
    root: {
      padding: theme.spacing(0),
      marginBottom: theme.spacing(0),
      marginTop: theme.spacing(0),
      display: 'flex',
      flexFlow: 'row nowrap',
    },
    // showing on top
    topPosition: {
      position: 'relative',
      marginBottom: theme.spacing(6),
      marginTop: -theme.spacing(3),
      zIndex: 'unset',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      width: '100%',
      maxWidth: 'inherit',
      flexWrap: 'nowrap',
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.banner.text,
      '& a': {
        color: theme.palette.banner.link,
      },
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  { name: 'BackstageHomepageBanner' },
);

export const Banner = (props: BannerProps) => {
  const classes = useStyles();
  const isOpen =
    props.startTime < DateTime.now() && DateTime.now() < props.endTime;
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={isOpen}
      classes={{
        root: classNames(classes.root, !false && classes.topPosition),
      }}
    >
      <SnackbarContent
        message={props.info}
        classes={{
          root: classNames(classes.content, classes.info),
          message: classes.message,
        }}
      />
    </Snackbar>
  );
};
