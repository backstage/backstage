import React, { FC } from 'react';
import { theme } from 'core/app/PageThemeProvider';
import { useUser, useProfile } from 'shared/apis/user';
import { Content, Header, Page } from 'shared/components/layout';
import { getTimeBasedGreeting } from 'shared/apis/time/timeUtil';
import HomePageTimer from 'plugins/homePage/components/HomePageTimer';
import HomeDrawer from 'plugins/homePage/components/HomeDrawer';
import { useThankYouMessage } from './hooks';

import ManageNavigation from './ManageNavigation';

const ManageLayout: FC<{}> = ({ children }) => {
  const user = useUser();
  const profile = useProfile();
  const thankYouMessage = useThankYouMessage(user.id);
  const greeting = getTimeBasedGreeting();

  return (
    <Page theme={theme.home}>
      <Header
        title={profile ? `${greeting.greeting}, ${profile.givenName}` : greeting.greeting}
        subtitle={thankYouMessage}
        tooltip={greeting.language}
        pageTitleOverride="Manage"
        type=""
      >
        <HomePageTimer />
      </Header>
      <ManageNavigation />
      <Content>{children}</Content>
      <HomeDrawer />
    </Page>
  );
};

export default ManageLayout;
