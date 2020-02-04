import React, { Component } from 'react';
import { Navigation, NavItem } from 'shared/components/layout';

class DataEndpointNavigation extends Component {
  render() {
    const { id, uri } = this.props;
    const dataEndpointBaseUrl = `/data-endpoints/${id}`;

    return (
      <Navigation>
        <NavItem title="Overview" href={dataEndpointBaseUrl} />
        <NavItem title="Downstreams" href={`${dataEndpointBaseUrl}/downstreams`} />
        <NavItem title="Upstreams" href={`${dataEndpointBaseUrl}/upstreams`} />
        <NavItem title="Lineage" href={`${dataEndpointBaseUrl}/lineage`} />
        <NavItem title="Counters" href={`${dataEndpointBaseUrl}/counters`} />
        <NavItem title="Metrics" href={`${dataEndpointBaseUrl}/metrics`} />
        <NavItem title="Validation" href={`${dataEndpointBaseUrl}/validation`} />
        <NavItem title="Profiling" href={`${dataEndpointBaseUrl}/profiling`} />
        {uri.startsWith('bq://') && <NavItem title="BigQuery Stats" href={`${dataEndpointBaseUrl}/bqstats`} />}
        <NavItem title="Test Certified" href={`${dataEndpointBaseUrl}/tc4x`} isBeta />
      </Navigation>
    );
  }
}

export default DataEndpointNavigation;
