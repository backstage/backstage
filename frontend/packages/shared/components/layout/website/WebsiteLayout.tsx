import React from 'react';
import gql from 'graphql-tag';

import { Content, Header, HeaderLabel, OwnerHeaderLabel, Page } from 'shared/components/layout';
import WebsiteNavigation from 'shared/components/layout/website/WebsiteNavigation';
import { theme } from 'core/app/PageThemeProvider';
import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';
import QueryLayout, { ComponentLayoutProps } from 'shared/components/layout/QueryLayout';
import ComponentWorkflowsEndpointsToolbar from 'shared/components/ComponentWorkflowsEndpointsToolbar';
import { Tc4xHeaderLabel } from 'plugins/tc4x/components/Tc4xHeaderLabel';

export default function WebsiteLayout({
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

  const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a Website named '${id}'`;
  return (
    <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
      {data => {
        const website = data.service;
        const facts = website.factsJson ? JSON.parse(website.factsJson) : {};
        const tier = facts.service_tier;

        return (
          <Page theme={theme.website}>
            <Header title={website.id} type="Website" component={website}>
              <OwnerHeaderLabel owner={website.owner} />
              {tier && <HeaderLabel label="Service Tier" value={`Tier ${tier}`} />}
              <HeaderLabel label="Lifecycle" value={website.lifecycle} />
              <Tc4xHeaderLabel componentId={website.id} />
              <ComponentContextMenu
                componentId={website.id}
                componentLocation={website.componentInfoLocationUri}
                componentType={website.componentType}
                roles={website.roles}
              />
            </Header>
            <WebsiteNavigation id={website.id} />
            <Content>{typeof children === 'function' ? children(website) : children}</Content>
          </Page>
        );
      }}
    </QueryLayout>
  );
}

const defaultProps: Partial<ComponentLayoutProps> = {
  handleEmptyCheck: data => !data.service,
  emptyTitleText: 'Website not found',
  emptyLink: '/websites-owned',
  emptyLinkText: 'Your Websites',
};

WebsiteLayout.defaultProps = defaultProps;
