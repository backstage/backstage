import React from 'react';
import gql from 'graphql-tag';

import { Content, Header, OwnerHeaderLabel, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import QueryLayout, { ComponentLayoutProps } from 'shared/components/layout/QueryLayout';
import ClientSDKNavigation from './ClientSDKNavigation';

export default function ClientSDKLayout({
  id,
  fragment,
  children,
  emptyHelperText,
  ...otherProps
}: ComponentLayoutProps) {
  const query = gql`
    query($id: String!) {
      clientSdk(id: $id) {
        id
        componentType
        owner {
          id
          name
          type
        }
        ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
      }
    }
    ${fragment || ''}
  `;

  const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a client sdk named '${id}'`;
  return (
    <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
      {data => {
        const clientSdk = data.clientSdk;

        return (
          <Page theme={theme.library}>
            <Header title={clientSdk.id} type="Client SDK" component={clientSdk}>
              <OwnerHeaderLabel owner={clientSdk.owner} />
            </Header>
            <ClientSDKNavigation id={clientSdk.id} />
            <Content>{typeof children === 'function' ? children(clientSdk) : children}</Content>
          </Page>
        );
      }}
    </QueryLayout>
  );
}

const defaultProps: Partial<ComponentLayoutProps> = {
  handleEmptyCheck: data => !data.clientSdk,
  emptyTitleText: 'Client SDK not found',
  emptyLink: '/explore/client-sdks',
  emptyLinkText: 'All Client SDKs',
};

ClientSDKLayout.defaultProps = defaultProps;
