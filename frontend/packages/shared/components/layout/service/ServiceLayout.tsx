import React from 'react';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import { Content, Header, HeaderLabel, OwnerHeaderLabel, Page } from 'shared/components/layout';
import ServiceNavigation from 'shared/components/layout/service/ServiceNavigation';
import { theme } from 'core/app/PageThemeProvider';

import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';
import QueryLayout, { ComponentLayoutProps } from 'shared/components/layout/QueryLayout';
import ComponentWorkflowsEndpointsToolbar from 'shared/components/ComponentWorkflowsEndpointsToolbar';
import { Tc4xHeaderLabel } from 'plugins/tc4x/components/Tc4xHeaderLabel';

export default function ServiceLayout({
  id,
  fragment,
  children,
  emptyHelperText,
  ...otherProps
}: ComponentLayoutProps) {
  const query = gql`
    query($id: String!) {
      service(id: $id) {
        id
        lifecycle
        componentType
        roles {
          id
          components {
            id
          }
        }
        factsJson
        owner {
          id
          name
          type
        }
        componentInfoLocationUri
        ...ComponentWorkflowsEndpointsDropdownInfo
        ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
      }
    }
    ${ComponentWorkflowsEndpointsToolbar.fragment}
    ${fragment || ''}
  `;

  const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a service named '${id}'`;
  return (
    <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
      {data => {
        const service = data.service;
        const facts = service.factsJson ? JSON.parse(service.factsJson) : {};
        const tier = facts.service_tier;
        const repository = service.repo ? `${service.repo.org}/${service.repo.project}` : '';

        if (service.componentType === 'website') {
          const url = window.location.pathname.replace('services/', 'websites/');
          return <Redirect to={url} />;
        } else if (service.componentType === 'library') {
          const url = window.location.pathname.replace('services/', 'libraries/');
          return <Redirect to={url} />;
        }

        return (
          <Page theme={theme.service}>
            <Header title={service.id} type="Service" component={service}>
              <OwnerHeaderLabel owner={service.owner} />
              {tier && <HeaderLabel label="Service Tier" value={`Tier ${tier}`} />}
              <HeaderLabel label="Lifecycle" value={service.lifecycle} />
              <Tc4xHeaderLabel componentId={service.id} />
              <ComponentContextMenu
                componentId={service.id}
                componentLocation={service.componentInfoLocationUri}
                componentType={service.componentType}
                roles={service.roles}
              />
            </Header>
            <ServiceNavigation id={service.id} repository={repository} />
            <Content>{typeof children === 'function' ? children(service) : children}</Content>
          </Page>
        );
      }}
    </QueryLayout>
  );
}

const defaultProps: Partial<ComponentLayoutProps> = {
  handleEmptyCheck: data => !data.service,
  emptyTitleText: 'Service not found',
  emptyLink: '/services-owned',
  emptyLinkText: 'Your services',
};

ServiceLayout.defaultProps = defaultProps;
