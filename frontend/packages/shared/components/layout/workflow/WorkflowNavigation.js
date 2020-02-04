import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

class WorkflowNavigation extends Component {
  render() {
    const { workflowId } = this.props;
    const workflowBaseUrl = `/workflows/${workflowId}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={workflowBaseUrl} />
        <NavItem title="Instances" href={`${workflowBaseUrl}/instances`} />
        <NavItem title="Backfills" href={`${workflowBaseUrl}/backfills`} exact={false} />
        <NavItem title="Dependencies" href={`${workflowBaseUrl}/dependencies`} />
        {FeatureFlags.getItem('workflow-alerts') && <NavItem title="Alerting" href={`${workflowBaseUrl}/alerts`} />}
      </Navigation>
    );
  }
}

export default WorkflowNavigation;
