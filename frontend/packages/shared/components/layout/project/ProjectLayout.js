import React, { Component } from 'react';
import gql from 'graphql-tag';

import { Content, Header, HeaderLabel, Page, QueryLayout } from 'shared/components/layout';
import ProjectNavigation from 'shared/components/layout/project/ProjectNavigation';
import { theme } from 'core/app/PageThemeProvider';

export default class ProjectLayout extends Component {
  static defaultProps = {
    handleEmptyCheck: data => !data.googleCloudPlatformProject,
    emptyTitleText: 'Project not found',
    emptyLink: '/projects-owned',
    emptyLinkText: 'Your projects',
  };

  render() {
    const { id, fragment, emptyHelperText, children, ...otherProps } = this.props;

    const query = gql`
      query($id: String!) {
        googleCloudPlatformProject(id: $id) {
          id
          owner {
            id
            name
          }
          ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
        }
      }
      ${fragment || ''}
    `;

    const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a project named '${id}'`;
    return (
      <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
        {data => {
          const project = data.googleCloudPlatformProject;

          return (
            <Page theme={theme.project}>
              <Header title={project.id} type="Project">
                <HeaderLabel
                  label="Owner"
                  value={project.owner && project.owner.name}
                  url={project.owner ? `/org/${project.owner.name}` : ''}
                />
              </Header>
              <ProjectNavigation projectId={project.id} />
              <Content>{typeof children === 'function' ? children(project) : children}</Content>
            </Page>
          );
        }}
      </QueryLayout>
    );
  }
}
