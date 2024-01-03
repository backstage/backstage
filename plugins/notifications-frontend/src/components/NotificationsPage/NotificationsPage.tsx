import React from 'react';
import { useParams } from 'react-router-dom';

import { Page, RoutedTabs } from '@backstage/core-components';

import { PersonalNotifications } from '../PersonalNotifications';
import { SendNotification } from '../SendNotification';
import { SystemNotifications } from '../SystemNotifications';

export const NotificationsPage = () => {
  const params = useParams();
  const isSend = params['*'] === 'send';

  const routes = [
    {
      path: 'personal',
      title: 'Personal',
      children: <PersonalNotifications />,
    },
    {
      path: 'updates',
      title: 'Updates',
      children: <SystemNotifications />,
    },
  ];

  if (isSend) {
    // This tab is not displayed by default, only when directly navigated by the URL.
    // Meant for demonstration and debug purposes, since the notifications are
    // expected to be send by 3rd party FE/BE plugins or external systems.
    routes.push({
      path: 'send',
      title: 'Send',
      children: <SendNotification />,
    });
  }

  return (
    <Page themeId="tool">
      <RoutedTabs routes={routes} />
    </Page>
  );
};
