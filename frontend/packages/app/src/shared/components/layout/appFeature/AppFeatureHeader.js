import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Header } from 'shared/components/layout';
import { HeaderLabel, OwnerHeaderLabel } from 'shared/components/layout';
import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';
import { coveragePercent } from 'plugins/health/util/CodeCoverageUtil';
import { Tc4xHeaderLabel } from 'plugins/tc4x/components/Tc4xHeaderLabel';

class AppFeatureHeader extends Component {
  static fragment = gql`
    fragment AppFeatureHeader on Component {
      id
      owner {
        id
        name
        type
      }
      componentType
      componentInfoLocationUri
      lifecycle
      codeCoverage {
        line {
          covered
          available
        }
      }
      componentInfoLocationUrl
    }
  `;

  render() {
    const { appFeature } = this.props;
    // HeaderLabel will show <Unknown> for null
    const codeCoveragePercent = appFeature.codeCoverage.line
      ? `${coveragePercent(appFeature.codeCoverage.line)}%`
      : null;

    return (
      <Header type="App Feature" title={appFeature.id}>
        <OwnerHeaderLabel owner={appFeature.owner} />
        <HeaderLabel label="Lifecycle" value={appFeature.lifecycle} />
        <HeaderLabel label="Coverage" value={codeCoveragePercent} />
        <Tc4xHeaderLabel componentId={appFeature.id} />
        <ComponentContextMenu
          componentId={appFeature.id}
          componentLocation={appFeature.componentInfoLocationUri}
          componentType={appFeature.componentType}
        />
      </Header>
    );
  }
}

export default AppFeatureHeader;
