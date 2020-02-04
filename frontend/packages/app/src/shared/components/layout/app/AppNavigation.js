import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

class AppNavigation extends Component {
  render() {
    const { id, system } = this.props;
    const baseUrl = `/apps/${id}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={baseUrl} />
        <NavItem title="App Features" href={`${baseUrl}/app-features`} />
        <NavItem title="Releases" href={`${baseUrl}/releases`} />
        <NavItem title="Builds" href={`${baseUrl}/build`} />
        <NavItem title="Code Coverage" href={`/system/${system}/code-coverage`} />
        <NavItem title="Tests" href={`/system/${system}/tests`} />
        <NavItem title="Crashes" href={`${baseUrl}/crashes`} isAlpha />
        <NavItem title="Performance" href={`${baseUrl}/performance`} exact={false} isAlpha />
      </Navigation>
    );
  }
}

export default AppNavigation;
