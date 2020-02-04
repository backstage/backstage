import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Content, Header, HeaderLabel, Page, QueryLayout } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';

export default class DocsLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.component,
    emptyTitleText: 'Documentation not found',
    emptyLink: '/docs',
    emptyLinkText: 'Find out more',
  };

  render() {
    const { id, fragment, children, ...otherProps } = this.props;

    const query = gql`
    query($id: String!) {
      component(id: $id) {
        id
        owner {
          id
          name
        }
        lifecycle
        componentType
        componentInfoLocationUri
        ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
      }
    }
    ${fragment || ''}
  `;

    const emptyHelperTextWithDefault = `We couldn't find documentation for '${id}'`;
    return (
      <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
        {data => {
          const component = data.component;
          return (
            <Page theme={theme.documentation}>
              <Header type="Documentation" title={component.id} component={component}>
                <HeaderLabel
                  label="Owner"
                  value={component.owner && component.owner.name}
                  url={component.owner ? `/org/${component.owner.name}` : ''}
                />
                <HeaderLabel label="Lifecycle" value={component.lifecycle} />
                <ComponentContextMenu
                  componentId={component.id}
                  componentLocation={component.componentInfoLocationUri}
                  componentType={component.componentType}
                />
              </Header>
              <Content style={{ padding: 0, margin: 0 }}>
                {typeof children === 'function' ? children(component) : children}
              </Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
