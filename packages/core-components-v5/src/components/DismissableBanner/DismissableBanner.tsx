/*
 * Copyright 2020 The Backstage Authors
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

import React, { ReactNode, useState, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/lib/useObservable';
import classNames from 'classnames';
import makeStyles from '@mui/styles/makeStyles';
import { BackstageTheme } from '@backstage/theme';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';

/** @public */
export type DismissableBannerClassKey =
  | 'root'
  | 'topPosition'
  | 'icon'
  | 'content'
  | 'message'
  | 'info'
  | 'error';

/**
 * @public
 * @deprecated This type contained a typo, please use DismissableBannerClassKey instead
 */
export type DismissbleBannerClassKey = DismissableBannerClassKey;

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
      fontSize: theme.typography.h6.fontSize,
    },
    content: {
      width: '100%',
      maxWidth: 'inherit',
      flexWrap: 'nowrap',
      color: theme.palette.banner.text,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      '& a': {
        color: theme.palette.banner.link,
      },
    },
    button: {
      color: theme.palette.banner.closeButtonColor ?? 'inherit',
    },
    info: {
      backgroundColor: theme.palette.banner.info,
    },
    error: {
      backgroundColor: theme.palette.banner.error,
    },
    warning: {
      backgroundColor:
        theme.palette.banner.warning ?? theme.palette.banner.error,
    },
  }),
  { name: 'BackstageDismissableBanner' },
);

export type Props = {
  variant: 'info' | 'error' | 'warning';
  message: ReactNode;
  id: string;
  fixed?: boolean;
};

/** @public */
export const DismissableBanner = (props: Props) => {
  const { variant, message, id, fixed = false } = props;
  const classes = useStyles();
  const storageApi = useApi(storageApiRef);
  const notificationsStore = storageApi.forBucket('notifications');
  const rawDismissedBanners =
    notificationsStore.snapshot<string[]>('dismissedBanners').value ?? [];

  const [dismissedBanners, setDismissedBanners] = useState(
    new Set(rawDismissedBanners),
  );

  const observedItems = useObservable(
    notificationsStore.observe$<string[]>('dismissedBanners'),
  );

  useEffect(() => {
    if (observedItems?.value) {
      const currentValue = observedItems?.value ?? [];
      setDismissedBanners(new Set(currentValue));
    }
  }, [observedItems?.value]);

  const handleClick = () => {
    notificationsStore.set('dismissedBanners', [...dismissedBanners, id]);
  };

  return (
    <Snackbar
      anchorOrigin={
        fixed
          ? { vertical: 'bottom', horizontal: 'center' }
          : { vertical: 'top', horizontal: 'center' }
      }
      open={!dismissedBanners.has(id)}
      classes={{
        root: classNames(classes.root, !fixed && classes.topPosition),
      }}
    >
      <SnackbarContent
        classes={{
          root: classNames(classes.content, classes[variant]),
          message: classes.message,
        }}
        message={message}
        action={[
          <IconButton
            key="dismiss"
            title="Permanently dismiss this message"
            className={classes.button}
            onClick={handleClick}
            size="large">
            <Close className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};
