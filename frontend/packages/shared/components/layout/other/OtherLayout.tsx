import React from 'react';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';

import { Content, Header, HeaderLabel, OwnerHeaderLabel, Page } from 'shared/components/layout';
import OtherNavigation from 'shared/components/layout/other/OtherNavigation';
import { theme } from 'core/app/PageThemeProvider';
import ComponentContextMenu from 'shared/apis/sysmodel/components/ComponentContextMenu';
import QueryLayout, { ComponentLayoutProps } from 'shared/components/layout/QueryLayout';
import ComponentWorkflowsEndpointsToolbar from 'shared/components/ComponentWorkflowsEndpointsToolbar';

const COMPONENTS_PATH_SUBSTR = '/components/';

export default function OtherLayout({ id, fragment, children, emptyHelperText, ...otherProps }: ComponentLayoutProps) {
  const query = gql`
    query($id: String!) {
      untypedComponents(ids: [$id]) {
        id
        owner {
          id
          name
          type
        }
        lifecycle
        componentType
        componentInfoLocationUri
        ...OtherNavigation
        ...ComponentWorkflowsEndpointsDropdownInfo
        ${fragment ? `...${fragment.definitions[0].name.value}` : ''}
      }
      services(ids: [$id]) { id }
      websites(ids: [$id]) { id }
      appFeatures(ids: [$id]) { id }
      libraries(ids: [$id]) { id }
    }
    ${OtherNavigation.fragment}
    ${ComponentWorkflowsEndpointsToolbar.fragment}
    ${fragment || ''}
  `;

  const emptyHelperTextWithDefault = emptyHelperText || `We couldn't find a component named '${id}'`;
  return (
    <QueryLayout query={query} variables={{ id }} emptyHelperText={emptyHelperTextWithDefault} {...otherProps}>
      {data => {
        const { services, websites, appFeatures, libraries, untypedComponents } = data;

        // Legacy redirects that deal with links from angular system-z
        const urlFragment = window.location.href.substr(
          window.location.href.indexOf(COMPONENTS_PATH_SUBSTR) + COMPONENTS_PATH_SUBSTR.length,
        );
        if (services && services.length) {
          return <Redirect to={`/services/${urlFragment}`} />;
        } else if (websites && websites.length) {
          return <Redirect to={`/websites/${urlFragment}`} />;
        } else if (appFeatures && appFeatures.length) {
          return <Redirect to={`/app-features/${urlFragment}`} />;
        } else if (libraries && libraries.length) {
          return <Redirect to={`/libraries/${urlFragment}`} />;
        } else if (
          untypedComponents &&
          untypedComponents.length &&
          untypedComponents[0].componentType === 'partnership'
        ) {
          return <Redirect to={`/partnerships/${urlFragment}`} />;
        }

        const component = data.untypedComponents && data.untypedComponents[0];

        if (!component) {
          throw new Error(`No component found when requesting "${id}"`);
        }

        return (
          <Page theme={theme.other}>
            <Header type="Other" title={component.id} component={component}>
              <OwnerHeaderLabel owner={component.owner} />
              <HeaderLabel label="Lifecycle" value={component.lifecycle} />
              <HeaderLabel label="Type" value={component.componentType} />
              <ComponentContextMenu
                componentId={component.id}
                componentLocation={component.componentInfoLocationUri}
                componentType={component.componentType}
              />
            </Header>
            <OtherNavigation component={component} />
            <Content>{typeof children === 'function' ? children(component) : children}</Content>
          </Page>
        );
      }}
    </QueryLayout>
  );
}

const defaultProps: Partial<ComponentLayoutProps> = {
  handleEmptyCheck: data => {
    const hasUntypedComponent = data.untypedComponents && data.untypedComponents.length;
    const hasService = data.services && data.services.length;
    const hasAppFeature = data.appFeatures && data.appFeatures.length;
    const hasWebsite = data.websites && data.websites.length;
    const hasLibrary = data.libraries && data.libraries.length;
    return !hasUntypedComponent && !hasService && !hasAppFeature && !hasWebsite && !hasLibrary;
  },
  emptyTitleText: 'Component not found',
  emptyLink: '/other-owned',
  emptyLinkText: 'Your other components',
};

OtherLayout.defaultProps = defaultProps;
