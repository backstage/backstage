import React, { Component } from 'react';
import gql from 'graphql-tag';
import { theme } from 'core/app/PageThemeProvider';
import { Content, Header, Page, QueryLayout } from 'shared/components/layout';
import DataEndpointNavigation from './DataEndpointNavigation';
import HeaderLabel from 'shared/components/layout/HeaderLabel';
import OwnerHeaderLabel from 'shared/components/layout/OwnerHeaderLabel';
import ComponentWorkflowsEndpointsToolbar from 'shared/components/ComponentWorkflowsEndpointsToolbar';

export default class DataEndpointLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.dataEndpoint,
    emptyTitleText: 'Data endpoint not found',
    emptyLink: '/data',
    emptyLinkText: 'Your data endpoints',
  };

  render() {
    const { id, fragment, children, ...otherProps } = this.props;

    const query = gql`
      query($id: String!) {
        dataEndpoint(id: $id) {
          id
          owner {
            id
            name
            contactEmail
            type
            slack
          }
          storageUriPattern
          lifecycle
          component {
            id
            owner {
              id
              name
            }
            ...ComponentWorkflowsEndpointsDropdownInfo
          }
          ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
        }
      }
      ${ComponentWorkflowsEndpointsToolbar.fragment}
      ${fragment || ''}
    `;

    const emptyHelperTextWithDefault = `We couldn't find a data endpoint named '${id}'`;
    return (
      <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
        {data => {
          const dataendpoint = data.dataEndpoint;
          return (
            <Page theme={theme.endpoint}>
              <Header type="Data Endpoint" title={dataendpoint.id} component={dataendpoint.component}>
                <OwnerHeaderLabel owner={dataendpoint.owner} />
                <HeaderLabel label="Lifecycle" value={dataendpoint.lifecycle} />
              </Header>
              <DataEndpointNavigation id={dataendpoint.id} uri={dataendpoint.storageUriPattern} />
              <Content>{typeof children === 'function' ? children(dataendpoint) : children}</Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
