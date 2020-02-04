import React, { Component } from 'react';

import { Navigation, NavItem } from 'shared/components/layout';

import StreamingIcon from 'shared/assets/icons/stream.svg';
import {
  AppFeatureIcon,
  DataEndpointsIcon,
  GcpProjectIcon,
  LibraryIcon,
  OtherIcon,
  OverviewIcon,
  ServiceIcon,
  WebsiteIcon,
  WorkflowIcon,
} from 'shared/icons';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

const style = { fill: '#727272' };

export class HomeNavigation extends Component {
  render() {
    return (
      <Navigation condensable>
        <NavItem title="Overview" icon={<OverviewIcon style={style} />} href={'/'} />
        <NavItem title="Services" icon={<ServiceIcon style={style} />} href={'/services-owned'} />
        <NavItem title="Websites" icon={<WebsiteIcon style={style} />} href={'/websites-owned'} isBeta />
        <NavItem title="Libraries" icon={<LibraryIcon style={style} />} href={'/libraries-owned'} isBeta />
        <NavItem title="Workflows" icon={<WorkflowIcon style={style} />} href={'/workflows-owned'} />
        <NavItem title="Data Endpoints" icon={<DataEndpointsIcon style={style} />} href={'/data'} />
        {FeatureFlags.getItem('galileo') && (
          <NavItem title="Streaming Pipelines" icon={StreamingIcon} href={'/streaming-pipelines-owned'} />
        )}
        <NavItem title="App Features" icon={<AppFeatureIcon style={style} />} href={'/app-features-owned'} />
        <NavItem title="GCP Projects" icon={<GcpProjectIcon style={style} />} href={'/projects-owned'} />
        <NavItem title="Other" icon={<OtherIcon style={style} />} href={'/other-owned'} />
      </Navigation>
    );
  }
}

export default HomeNavigation;
