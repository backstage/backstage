import React from 'react';
import gql from 'graphql-tag';

import { Content, Page } from 'shared/components/layout';
import { theme } from 'core/app/PageThemeProvider';
import AppFeatureNavigation from 'shared/components/layout/appFeature/AppFeatureNavigation';
import QueryLayout, { ComponentLayoutProps } from 'shared/components/layout/QueryLayout';
import AppFeatureHeader from 'shared/components/layout/appFeature/AppFeatureHeader';

export default function AppFeatureLayout({
  id,
  fragment,
  emptyHelperText,
  children,
  ...otherProps
}: ComponentLayoutProps) {
  const query = gql`
    query($id: String!) {
      appFeature(id: $id) {
        id
        ...AppFeatureHeader
        ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
      }
    }
    ${AppFeatureHeader.fragment}
    ${fragment || ''}
  `;

  const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a feature named '${id}'`;
  return (
    <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
      {data => {
        const appFeature = data.appFeature;

        return (
          <Page theme={theme.appFeature}>
            <AppFeatureHeader appFeature={appFeature} />
            <AppFeatureNavigation id={appFeature.id} />
            <Content>{typeof children === 'function' ? children(appFeature) : children}</Content>
          </Page>
        );
      }}
    </QueryLayout>
  );
}

const defaultProps: Partial<ComponentLayoutProps> = {
  handleEmptyCheck: data => !data.appFeature,
  emptyTitleText: 'Application feature not found',
  emptyLink: '/app-features-owned',
  emptyLinkText: 'Your application features',
};

AppFeatureLayout.defaultProps = defaultProps;
