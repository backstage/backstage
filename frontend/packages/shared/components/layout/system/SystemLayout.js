import React, { Component } from 'react';
import gql from 'graphql-tag';

import { theme } from 'core/app/PageThemeProvider';
import { Content, Header, Page, QueryLayout } from 'shared/components/layout';
import SystemNavigation from './SystemNavigation';

export default class SystemLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.system,
    emptyTitleText: 'System not found',
  };

  render() {
    const { id, fragment, emptyHelperText, children, ...otherProps } = this.props;

    const queryToPerform = gql`
      query($id: String!) {
        system(id: $id) {
          id
          ...SystemNavigation
          ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
        }
      }
      ${SystemNavigation.fragment}
      ${fragment || ''}
    `;

    const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a system named '${id}'`;
    return (
      <QueryLayout
        query={queryToPerform}
        variables={{ id }}
        emptyHelperText={emptyHelperTextWithDefault}
        {...otherProps}
      >
        {data => {
          const system = data.system;

          return (
            <Page theme={theme.system}>
              <Header type="System" title={system.id} />
              <SystemNavigation system={system} />
              <Content>{typeof children === 'function' ? children(system) : children}</Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
