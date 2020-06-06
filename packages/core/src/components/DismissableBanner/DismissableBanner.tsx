/*
 * Copyright 2020 Spotify AB
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

import React, { FC, ReactNode, useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useApi, storageApiRef } from '@backstage/core';
import { useObservable } from 'react-use';
import classNames from 'classnames';
import { makeStyles, Theme } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
// import { useSetting, Setting } from 'shared/apis/settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'relative',
    padding: theme.spacing(0),
    marginBottom: theme.spacing(6),
    marginTop: -theme.spacing(3),
    display: 'flex',
    flexFlow: 'row nowrap',
    zIndex: 'unset',
  },
  icon: {
    fontSize: 20,
  },
  content: {
    width: '100%',
    maxWidth: 'inherit',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

type Props = {
  variant: 'info' | 'error';
  // setting: Setting<boolean>;
  message: ReactNode;
};

const DismissableBanner: FC<Props> = ({ variant, /* setting, */ message }) => {
  // const [show, setShown, loading] = useSetting(setting);
  const classes = useStyles();
  const storageApi = useApi(storageApiRef);
  const settingsStore = storageApi.forBucket('settings');
  const rawDismissedBanners =
    settingsStore.get<string[]>('dismissedBanners') ?? [];

  const [dismissedBanners, setDismissedBanners] = useState(
    new Set(rawDismissedBanners),
  );

  const observedItems = useObservable(
    settingsStore.observe$<string[]>('dismissedBanners'),
  );

  useEffect(() => {
    // Only want to run on updates, not first time
    if (observedItems?.newValue) {
      const currentValue = observedItems?.newValue ?? [];
      setDismissedBanners(new Set(currentValue));
    }
  }, [observedItems?.newValue]);

  const handleClick = () => {
    settingsStore.set('dismissedBanners', [
      ...dismissedBanners,
      ReactDOMServer.renderToString(message),
    ]);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={!dismissedBanners.has(ReactDOMServer.renderToString(message))}
      classes={{ root: classes.root }}
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
            color="inherit"
            onClick={handleClick}
          >
            <Close className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
};

export default DismissableBanner;
