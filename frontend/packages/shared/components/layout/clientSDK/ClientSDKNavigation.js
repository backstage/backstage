import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

class ClientSDKNavigation extends Component {
  render() {
    const { id } = this.props;
    const clientSDKUrl = `/client-sdks/${id}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={clientSDKUrl} />
      </Navigation>
    );
  }
}

export default ClientSDKNavigation;
