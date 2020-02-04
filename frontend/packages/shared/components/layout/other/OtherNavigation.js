import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Navigation, NavItem } from 'shared/components/layout';

class OtherNavigation extends Component {
  static fragment = gql`
    fragment OtherNavigation on Component {
      dataEndpoints {
        id
      }
      workflows {
        id
      }
    }
  `;

  render() {
    const { component } = this.props;
    const baseUrl = `/components/${component.id}`;
    const hasDataEndpoints = component.dataEndpoints.length > 0;
    const hasWorkflows = component.workflows.length > 0;

    return (
      <Navigation>
        <NavItem title="Overview" href={baseUrl} />
        <NavItem title="CI/CD" href={`${baseUrl}/tingle`} exact={false} />
        <NavItem title="Tests" href={`${baseUrl}/tests`} />
        <NavItem title="Code Coverage" href={`${baseUrl}/code-coverage`} isAlpha exact={false} />
        {hasWorkflows && <NavItem title="Workflows" href={`${baseUrl}/workflows`} />}
        {hasDataEndpoints && <NavItem title="Data Endpoints" href={`${baseUrl}/data-endpoints`} />}
      </Navigation>
    );
  }
}

export default OtherNavigation;
