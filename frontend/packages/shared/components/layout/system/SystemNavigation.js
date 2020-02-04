import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Navigation, NavItem } from 'shared/components/layout';

class SystemNavigation extends Component {
  static fragment = gql`
    fragment SystemNavigation on System {
      id
      testing {
        distribution {
          type
        }
      }
      codeCoverage {
        history {
          date
        }
      }
    }
  `;

  render() {
    const { id, codeCoverage, testing } = this.props.system;
    const systemBaseUrl = `/system/${id}`;
    const hasTesting = testing.distribution && testing.distribution.length > 0;
    const hasCodeCoverage = codeCoverage.history && codeCoverage.history.length > 0;

    return (
      <Navigation>
        <NavItem title="Overview" href={systemBaseUrl} />
        <NavItem title="Services" href={`${systemBaseUrl}/services`} />
        <NavItem title="App Features" href={`${systemBaseUrl}/app-features`} />
        <NavItem title="Other components" href={`${systemBaseUrl}/other-components`} />
        {hasCodeCoverage && (
          <NavItem title="Code Coverage" href={`${systemBaseUrl}/code-coverage`} isAlpha exact={false} />
        )}
        {hasTesting && <NavItem title="Tests" href={`${systemBaseUrl}/tests`} isAlpha exact={false} />}
      </Navigation>
    );
  }
}

export default SystemNavigation;
