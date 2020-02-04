import React, { Component } from 'react';
import {
  AppFeatureIcon,
  DataEndpointsIcon,
  OtherIcon,
  OverviewIcon,
  PartnershipIcon,
  ServiceIcon,
  TestIcon,
  WebsiteIcon,
  WorkflowIcon,
} from 'shared/icons';
import SpeedIcon from '@material-ui/icons/Speed';
import { Navigation, NavItem } from 'shared/components/layout';
import gql from 'graphql-tag';

class OrgEntityNavigation extends Component {
  static fragment = gql`
    fragment OrgEntityNavigation on Squad {
      testing {
        distribution {
          type
          count
        }
      }
      services {
        id
      }
      websites {
        id
      }
      appFeatures {
        id
      }
      workflows {
        id
      }
      dataEndpoints {
        id
      }
      tcBuildConfigurations {
        id
      }
      untypedComponents {
        id
        componentType
      }
    }
  `;

  render() {
    const { entityName, entityData } = this.props;
    const { squad } = entityData;

    const services =
      squad.services &&
      squad.services.filter(service => {
        return service.componentType !== 'website';
      });

    const orgEntityBaseUrl = `/org/${entityName}`;
    const hasTests = squad.testing && squad.testing.distribution && squad.testing.distribution.length > 0;
    const hasServices = services && services.length > 0;
    const hasWebsites = squad.websites && squad.websites.length > 0;
    const hasAppFeautres = squad.appFeatures && squad.appFeatures.length > 0;
    const hasWorkflows = squad.workflows && squad.workflows.length > 0;
    const hasDataEndpoints = squad.dataEndpoints && squad.dataEndpoints.length > 0;
    const hasTCBuildConfigs = squad.tcBuildConfigurations && squad.tcBuildConfigurations.length > 0;
    const hasOtherComponents = squad.untypedComponents && squad.untypedComponents.length > 0;
    const hasPartnershipComponents =
      squad.untypedComponents && squad.untypedComponents.find(c => c.componentType === 'partnership');

    const iconStyle = { fill: '#727272' };

    return (
      <Navigation>
        <NavItem title="Overview" href={orgEntityBaseUrl} icon={<OverviewIcon style={iconStyle} />} />
        {hasTests && <NavItem title="Tests" href={`${orgEntityBaseUrl}/tests`} icon={<TestIcon style={iconStyle} />} />}
        {hasServices && (
          <NavItem title="Services" href={`${orgEntityBaseUrl}/services`} icon={<ServiceIcon style={iconStyle} />} />
        )}
        {hasWebsites && (
          <NavItem title="Websites" href={`${orgEntityBaseUrl}/websites`} icon={<WebsiteIcon style={iconStyle} />} />
        )}
        {hasAppFeautres && (
          <NavItem
            title="App Features"
            href={`${orgEntityBaseUrl}/app-features`}
            icon={<AppFeatureIcon style={iconStyle} />}
          />
        )}
        {hasWorkflows && (
          <NavItem title="Workflows" href={`${orgEntityBaseUrl}/workflows`} icon={<WorkflowIcon style={iconStyle} />} />
        )}
        {hasDataEndpoints && (
          <NavItem
            title="Data Endpoints"
            href={`${orgEntityBaseUrl}/data-endpoints`}
            icon={<DataEndpointsIcon style={iconStyle} />}
          />
        )}
        {hasPartnershipComponents && (
          <NavItem
            title="Partnerships"
            href={`${orgEntityBaseUrl}/partnerships`}
            icon={<PartnershipIcon style={iconStyle} />}
          />
        )}
        {hasTCBuildConfigs && (
          <NavItem
            title="TC Build Configs"
            href={`${orgEntityBaseUrl}/build-configurations`}
            icon={<OtherIcon style={{ fill: '#727272' }} />}
          />
        )}
        {hasOtherComponents && (
          <NavItem title="Other" href={`${orgEntityBaseUrl}/other-components`} icon={<OtherIcon style={iconStyle} />} />
        )}
        <NavItem
          isAlpha
          exact={false}
          title="Performance"
          href={`${orgEntityBaseUrl}/performance`}
          icon={<SpeedIcon style={{ fill: '#727272' }} />}
        />
        {squad.id === 'release' && (
          <NavItem
            isAlpha
            title="Release Manager"
            href={`${orgEntityBaseUrl}/releasemanager`}
            icon={<OtherIcon style={{ fill: '#727272' }} />}
          />
        )}
      </Navigation>
    );
  }
}

export default OrgEntityNavigation;
