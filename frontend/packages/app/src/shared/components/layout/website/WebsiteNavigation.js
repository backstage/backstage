import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

class WebsiteNavigation extends Component {
  render() {
    const { id } = this.props;
    const websiteBaseUrl = `/websites/${id}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={websiteBaseUrl} />
        {/* build */}
        <NavItem title="CI/CD" href={`${websiteBaseUrl}/tingle`} exact={false} />
        <NavItem title="Tests" href={`${websiteBaseUrl}/tests`} />
        <NavItem title="Code Coverage" href={`${websiteBaseUrl}/code-coverage`} isAlpha exact={false} />
        {/* deploy */}
        <NavItem title="Capacity" href={`${websiteBaseUrl}/capacity`} />
        <NavItem title="Deployments" href={`${websiteBaseUrl}/deployment`} />
        <NavItem title="Podlinks" href={`${websiteBaseUrl}/service-discovery`} isBeta />
        {/* observability */}
        <NavItem title="Service Levels" href={`${websiteBaseUrl}/service-levels`} />
        {/* rutime config */}
        <NavItem title="Remote Config" href={`${websiteBaseUrl}/remote-config`} isBeta />
        <NavItem title="Secrets" href={`${websiteBaseUrl}/celo`} />
        <NavItem title="DNS" href={`${websiteBaseUrl}/dns`} isBeta />
        {/* audits */}
        <NavItem title="Test Certified" href={`${websiteBaseUrl}/tc4x`} isBeta />
        <NavItem title="Lighthouse" href={`${websiteBaseUrl}/lighthouse`} isAlpha />
      </Navigation>
    );
  }
}

export default WebsiteNavigation;
