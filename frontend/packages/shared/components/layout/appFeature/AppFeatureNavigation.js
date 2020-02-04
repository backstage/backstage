import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

class AppFeatureNavigation extends Component {
  render() {
    const { id } = this.props;
    const appFeatureBaseUrl = `/app-features/${id}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={appFeatureBaseUrl} />
        <NavItem title="Code Coverage" href={`${appFeatureBaseUrl}/code-coverage`} isBeta exact={false} />
        <NavItem title="Code Health" href={`${appFeatureBaseUrl}/health`} isBeta />
        <NavItem title="Remote Config" href={`${appFeatureBaseUrl}/remote-config`} isBeta />
        <NavItem title="Tests" href={`${appFeatureBaseUrl}/tests`} isBeta />
        <NavItem title="Crashes" href={`${appFeatureBaseUrl}/crashes`} isAlpha />
        <NavItem title="Test Certified" href={`${appFeatureBaseUrl}/tc4x`} isAlpha />
      </Navigation>
    );
  }
}

export default AppFeatureNavigation;
