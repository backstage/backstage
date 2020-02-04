import React from 'react';

import DataSciIcon from '@material-ui/icons/Timeline';
import { AppIcon, PlatformIcon, ToolsIcon, SdkIcon } from 'shared/icons';
import { Content, Header, Navigation, NavItem, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';

const iconStyle = { fill: '#727272' };

export default class ExploreLayout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Page theme={theme.home}>
        <Header title="Explore the Spotify ecosystem" subtitle="Discover data, Apps, Platforms and much more" />
        <Navigation condensable>
          <NavItem title="Platforms" icon={<PlatformIcon style={iconStyle} />} href="/explore" />
          <NavItem title="Infrastructure" icon={<ToolsIcon style={iconStyle} />} href="/explore/infra" />
          <NavItem title="Client SDKs" icon={<SdkIcon style={iconStyle} />} href="/explore/client-sdks" />
          <NavItem title="Apps" icon={<AppIcon style={iconStyle} />} href="/apps" isBeta />
          <NavItem title="Tools (legacy)" icon={<ToolsIcon style={iconStyle} />} href="/explore/tools" />
          <NavItem title="Data Science Tools" icon={<DataSciIcon style={iconStyle} />} href="/data-science-tools" />
        </Navigation>
        <Content>{children}</Content>
      </Page>
    );
  }
}
