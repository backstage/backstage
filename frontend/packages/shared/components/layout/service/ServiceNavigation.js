import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';
import { EVINCE_CA } from 'plugins/complianceAdvisor/ComplianceAdvisorPlugin';

class ServiceNavigation extends Component {
  render() {
    const { id, repository } = this.props;
    const serviceBaseUrl = `/services/${id}`;
    const isCassandra = id.endsWith('cass') || id.endsWith('cassandra');

    return (
      <Navigation>
        <NavItem title="Overview" href={serviceBaseUrl} />
        {/* build */}
        <NavItem title="CI/CD" href={`${serviceBaseUrl}/tingle`} exact={false} />
        <NavItem title="Tests" href={`${serviceBaseUrl}/tests`} />
        <NavItem title="Code Coverage" href={`${serviceBaseUrl}/code-coverage`} isAlpha exact={false} />
        {FeatureFlags.getItem('source-indexer') && (
          <NavItem
            title="Java Source Browser"
            href={`http://source-indexer-service.spotify.net/web/code/${repository}`}
            isAlpha
          />
        )}
        {/* deploy */}
        <NavItem title="Capacity" href={`${serviceBaseUrl}/capacity`} />
        <NavItem title="Deployments" href={`${serviceBaseUrl}/deployment`} />
        <NavItem title="Podlinks" href={`${serviceBaseUrl}/service-discovery`} />
        {/* monitoring */}
        <NavItem title="Monitoring" href={`${serviceBaseUrl}/monitoring`} exact={false} />
        <NavItem title="Service Levels" href={`${serviceBaseUrl}/service-levels`} />
        {/* runtime config...? */}
        <NavItem title="API" href={`${serviceBaseUrl}/api`} />
        <NavItem title="Remote Config" href={`${serviceBaseUrl}/remote-config`} isBeta />
        <NavItem title="Secrets" href={`${serviceBaseUrl}/celo`} />
        {isCassandra && <NavItem title="Reaper" href={`${serviceBaseUrl}/reaper`} />}
        {/* audits */}
        <NavItem title="Test Certified" href={`${serviceBaseUrl}/tc4x`} isBeta />
        <NavItem title="Service Advisor" href={`${serviceBaseUrl}/service-advisor`} />
        <NavItem title="Cost Efficiency" href={`${serviceBaseUrl}/efficiency`} />
        {FeatureFlags.getItem(EVINCE_CA) && (
          <NavItem title="Compliance Advisor" href={`${serviceBaseUrl}/compliance-advisor`} isAlpha />
        )}
      </Navigation>
    );
  }
}

export default ServiceNavigation;
