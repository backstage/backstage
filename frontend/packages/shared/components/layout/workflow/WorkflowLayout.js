import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Content, Header, HeaderLabel, OwnerHeaderLabel, Page, QueryLayout } from 'shared/components/layout';
import WorkflowNavigation from 'shared/components/layout/workflow/WorkflowNavigation';
import { theme } from 'core/app/PageThemeProvider';
import MissingComponent from 'plugins/workflows/components/MissingComponent';
import ComponentWorkflowsEndpointsToolbar from 'shared/components/ComponentWorkflowsEndpointsToolbar';

export default class WorkflowLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.workflow,
    emptyTitleText: 'Workflow not found',
    emptyLink: '/workflows-owned',
    emptyLinkText: 'Your workflows',
  };

  render() {
    const { id, fragment, emptyHelperText, children, ...otherProps } = this.props;

    const query = gql`
        query($id: String!) {
          workflow(id: $id) {
            id
            component {
              id
              lifecycle
              owner {
                id
                name
                type
              }
              ...ComponentWorkflowsEndpointsDropdownInfo
            }
            ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
          }
        }
        ${ComponentWorkflowsEndpointsToolbar.fragment}
        ${fragment || ''}
      `;

    const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a workflow named '${id}'`;
    return (
      <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
        {data => {
          const workflow = data.workflow;
          if (!workflow.component) {
            return <MissingComponent workflowId={workflow.id} />;
          }
          const { component } = workflow;
          return (
            <Page theme={theme.workflow}>
              <Header title={workflow.id} type="Workflow" component={component}>
                <HeaderLabel
                  label="Component"
                  value={component && workflow.component.id}
                  url={component ? `/components/${component.id}` : ''}
                />
                <OwnerHeaderLabel owner={component && component.owner} />
                <HeaderLabel label="Lifecycle" value={component && component.lifecycle} />
              </Header>
              <WorkflowNavigation workflowId={workflow.id} />
              <Content>{typeof children === 'function' ? children(workflow) : children}</Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
