import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Switch, FormControlLabel } from '@material-ui/core';
import { Content, Header, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import QueryLayout from 'shared/components/layout/QueryLayout';
import OrgEntityNavigation from 'shared/components/layout/orgEntity/OrgEntityNavigation';

export default class OrgEntityLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideNonProd: false,
    };

    this.toggleHideNonProd = this.toggleHideNonProd.bind(this);
    this.getProdToggle = this.getProdToggle.bind(this);
    this.prodFilter = this.prodFilter.bind(this);
  }

  toggleHideNonProd() {
    this.setState(oldState => ({ ...oldState, hideNonProd: !oldState.hideNonProd }));
  }

  prodFilter(components) {
    return components.filter(component =>
      this.state.hideNonProd ? component.lifecycle === 'production' || component.lifecycle === 'OPERATIONAL' : true,
    );
  }

  getProdToggle() {
    return (
      <FormControlLabel
        control={<Switch checked={this.state.hideNonProd} onChange={this.toggleHideNonProd} />}
        label={'Show only Production components'}
      />
    );
  }

  getWelcomeSubtitle = squad => {
    const total =
      squad.services.length + squad.workflows.length + squad.dataEndpoints.length + squad.untypedComponents.length;
    const projects = squad.googleCloudPlatformProjects ? squad.googleCloudPlatformProjects.length : 0;
    let subtitle = null;
    if (total > 0 || projects > 0) {
      subtitle = `Thank ${squad.name} for taking care of`;
      if (total > 0) {
        subtitle += ` ${total} `;
        subtitle += total === 1 ? 'component' : 'components';
        subtitle += projects > 0 ? ' and ' : '';
      }
      if (projects > 0) {
        subtitle += ` ${projects} `;
        subtitle += projects === 1 ? 'project' : 'projects';
      }
    }
    return subtitle;
  };

  static defaultProps = {
    emptyTitleText: 'Squad not found',
  };

  render() {
    const { entityName, fragment, children, ...otherProps } = this.props;

    const query = gql`
      query($name: String!) {
        squad(name: $name) {
          id
          name
          type
          ...OrgEntityNavigation
          ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
        }
      }
      ${OrgEntityNavigation.fragment}
      ${fragment || ''}
    `;

    return (
      <QueryLayout
        query={query}
        variables={{ name: entityName }}
        emptyHelperText={`We couldn't find a squad named '${entityName}'`}
        {...otherProps}
      >
        {data => {
          const filteredData = {
            ...data,
            squad: {
              ...data.squad,
              untypedComponents: this.prodFilter(data.squad.untypedComponents),
              services: this.prodFilter(data.squad.services),
              workflows: this.prodFilter(data.squad.workflows),
              dataEndpoints: this.prodFilter(data.squad.dataEndpoints),
            },
          };
          const subtitle = this.getWelcomeSubtitle(filteredData.squad);
          return (
            <Page theme={theme.org}>
              <Header title={entityName} type="Squad" subtitle={subtitle} />
              <OrgEntityNavigation entityName={entityName} entityData={filteredData} />
              <Content>
                {typeof children === 'function' ? children(filteredData, this.getProdToggle) : children}
              </Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
