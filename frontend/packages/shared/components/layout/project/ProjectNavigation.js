import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

class ProjectNavigation extends Component {
  render() {
    const { projectId } = this.props;
    const projectBaseUrl = `/projects/${projectId}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={projectBaseUrl} />
        <NavItem title="Bigtable" href={`${projectBaseUrl}/bigtable`} />
      </Navigation>
    );
  }
}

export default ProjectNavigation;
