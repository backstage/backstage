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

import React from 'react';
import { Link } from '@backstage/core-components';
import {
  ListItem,
  ListItemSecondaryAction,
  Tooltip,
  ListItemText,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import { DateTime, Duration } from 'luxon';
import { PagerDutyChangeEvent } from '../types';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>({
  denseListIcon: {
    marginRight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemPrimary: {
    fontWeight: 'bold',
  },
});

type Props = {
  changeEvent: PagerDutyChangeEvent;
};

export const ChangeEventListItem = ({ changeEvent }: Props) => {
  const classes = useStyles();
  const duration =
    new Date().getTime() - new Date(changeEvent.timestamp).getTime();
  const changedAt = DateTime.local()
    .minus(Duration.fromMillis(duration))
    .toRelative({ locale: 'en' });
  let externalLinkElem: JSX.Element | undefined;
  if (changeEvent.links.length > 0) {
    const text: string = changeEvent.links[0].text;
    externalLinkElem = (
      <Tooltip title={text} placement="top">
        <IconButton
          component={Link}
          to={changeEvent.links[0].href}
          color="primary"
        >
          <OpenInBrowserIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <ListItem dense key={changeEvent.id}>
      <ListItemText
        primary={<>{changeEvent.summary}</>}
        primaryTypographyProps={{
          variant: 'body1',
          className: classes.listItemPrimary,
        }}
        secondary={
          <Typography variant="body2" color="textSecondary">
            Triggered from {changeEvent.source} {changedAt}.
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        {externalLinkElem}
        {changeEvent.html_url === undefined ? null : (
          <Tooltip title="View in PagerDuty" placement="top">
            <IconButton
              component={Link}
              to={changeEvent.html_url}
              color="primary"
            >
              <OpenInBrowserIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
