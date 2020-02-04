import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Content, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import AppNavigation from 'shared/components/layout/app/AppNavigation';
import QueryLayout from 'shared/components/layout/QueryLayout';
import AppHeader from 'shared/components/layout/app/AppHeader';

export default class AppLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.app,
    emptyTitleText: 'Application not found',
    emptyLink: '/apps',
    emptyLinkText: 'Applications',
  };

  render() {
    const { id, fragment, emptyHelperText, children, ...otherProps } = this.props;
    const query = gql`
      query App($id: String!) {
        app(id: $id) {
          id
          ...AppHeader
          ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
        }
      }
      ${AppHeader.fragment}
      ${fragment || ''}
    `;

    const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a feature named '${id}'`;
    return (
      <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
        {data => {
          const app = data.app;
          return (
            <Page theme={theme.app}>
              <AppHeader app={app} />
              <AppNavigation id={app.id} system={app.system} />
              <Content>{typeof children === 'function' ? children(app) : children}</Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
