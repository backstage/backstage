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
import { useNotifications } from '@backstage/core-app-api';
import {
  Content,
  Header,
  Page,
  SidebarPinStateContext,
} from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import React, { useContext } from 'react';

const useStyles = makeStyles(
  (theme: BackstageTheme) =>
    createStyles({
      card: {
        marginBottom: theme.spacing(1),
        maxWidth: 800,
      },
      actions: {
        justifyContent: 'flex-start',
      },
    }),
  { name: 'BackstageNotifications' },
);

export const NotificationsPage = () => {
  const classes = useStyles();
  const { isMobile } = useContext(SidebarPinStateContext);

  const { notifications, acknowledge } = useNotifications();
  const userNotifications = notifications.filter(n => n.spec?.targetEntityRefs);
  if (userNotifications.length) {
    acknowledge(notifications[0].metadata.timestamp);
  }

  return (
    <Page themeId="home">
      {!isMobile && <Header title="Notifications" />}
      <Content>
        {userNotifications.length ? (
          userNotifications.map(notification => (
            <Card key={notification.metadata.uuid} className={classes.card}>
              <CardHeader
                title={notification.metadata.title}
                avatar={notification.spec?.icon ?? <ChatIcon />}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>{notification.metadata.message}</CardContent>
              <CardActions className={classes.actions}>
                {(notification.spec?.links ?? []).map(link => (
                  <Button size="small" color="primary">
                    {link.title}
                  </Button>
                ))}
              </CardActions>
            </Card>
          ))
        ) : (
          <div>Such empty notifications, wow.</div>
        )}
      </Content>
    </Page>
  );
};
