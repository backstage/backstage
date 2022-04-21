/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const addImports = require('jscodeshift-add-imports');

// The symbols in this table are out of date, but it does NOT need updating.
// They're from a snapshot in the past and only need to handle the migration
// away from @backstage/core.
const symbolTable = {
  '@backstage/app-defaults': ['createApp'],
  '@backstage/core-app-api': [
    'ConfigReader',
    'AlertApiForwarder',
    'ApiFactoryHolder',
    'ApiFactoryRegistry',
    'ApiProvider',
    'ApiRegistry',
    'ApiResolver',
    'AppComponents',
    'AppConfigLoader',
    'AppContext',
    'AppOptions',
    'AppRouteBinder',
    'AppThemeSelector',
    'Auth0Auth',
    'BackstageApp',
    'BackstagePluginWithAnyOutput',
    'BootErrorPageProps',
    'ErrorAlerter',
    'ErrorApiForwarder',
    'ErrorBoundaryFallbackProps',
    'FeatureFlagged',
    'FeatureFlaggedProps',
    'FlatRoutes',
    'GithubAuth',
    'GithubSession',
    'GitlabAuth',
    'GoogleAuth',
    'LocalStorageFeatureFlags',
    'MicrosoftAuth',
    'OAuth2',
    'OAuth2Session',
    'OAuthRequestManager',
    'OktaAuth',
    'OneLoginAuth',
    'SamlAuth',
    'SignInPageProps',
    'SignInResult',
    'UrlPatternDiscovery',
    'WebStorage',
  ],
  '@backstage/core-components': [
    'AlertDisplay',
    'Avatar',
    'Breadcrumbs',
    'BrokenImageIcon',
    'Button',
    'CardTab',
    'CatalogIcon',
    'ChatIcon',
    'CodeSnippet',
    'Content',
    'ContentHeader',
    'CopyTextButton',
    'DashboardIcon',
    'DependencyGraph',
    'DependencyGraphTypes',
    'DismissableBanner',
    'DocsIcon',
    'EmailIcon',
    'EmptyState',
    'ErrorBoundary',
    'ErrorPage',
    'ErrorPanel',
    'ErrorPanelProps',
    'FeatureCalloutCircular',
    'Gauge',
    'GaugeCard',
    'GitHubIcon',
    'GroupIcon',
    'Header',
    'HeaderIconLinkRow',
    'HeaderLabel',
    'HeaderTabs',
    'HelpIcon',
    'HomepageTimer',
    'HorizontalScrollGrid',
    'IconLinkVerticalProps',
    'InfoCard',
    'InfoCardVariants',
    'IntroCard',
    'ItemCard',
    'ItemCardGrid',
    'ItemCardGridProps',
    'ItemCardHeader',
    'ItemCardHeaderProps',
    'Lifecycle',
    'LinearGauge',
    'Link',
    'LinkProps',
    'MarkdownContent',
    'MissingAnnotationEmptyState',
    'OAuthRequestDialog',
    'OverflowTooltip',
    'Page',
    'Progress',
    'ResponseErrorPanel',
    'RoutedTabs',
    'SIDEBAR_INTRO_LOCAL_STORAGE',
    'Select',
    'Sidebar',
    'SidebarContext',
    'SidebarContextType',
    'SidebarDivider',
    'SidebarIntro',
    'SidebarItem',
    'SidebarPage',
    'SidebarPinStateContext',
    'SidebarPinStateContextType',
    'SidebarSearchField',
    'SidebarSpace',
    'SidebarSpacer',
    'SignInPage',
    'SignInProviderConfig',
    'SimpleStepper',
    'SimpleStepperStep',
    'StatusAborted',
    'StatusError',
    'StatusOK',
    'StatusPending',
    'StatusRunning',
    'StatusWarning',
    'StructuredMetadataTable',
    'SubvalueCell',
    'SupportButton',
    'SupportConfig',
    'SupportItem',
    'SupportItemLink',
    'Tab',
    'TabbedCard',
    'TabbedLayout',
    'Table',
    'TableColumn',
    'TableFilter',
    'TableProps',
    'TableState',
    'Tabs',
    'TrendLine',
    'UserIcon',
    'WarningIcon',
    'WarningPanel',
    'sidebarConfig',
    'useQueryParamState',
    'useSupportConfig',
  ],
  '@backstage/core-plugin-api': [
    'AlertApi',
    'AlertMessage',
    'AnyApiFactory',
    'AnyApiRef',
    'ApiFactory',
    'ApiHolder',
    'ApiRef',
    'ApiRefType',
    'ApiRefsToTypes',
    'AppComponents',
    'AppContext',
    'AppTheme',
    'AppThemeApi',
    'AuthProvider',
    'AuthRequestOptions',
    'AuthRequester',
    'AuthRequesterOptions',
    'BackstageIdentity',
    'BackstageIdentityApi',
    'BackstagePlugin',
    'BootErrorPageProps',
    'ConfigApi',
    'DiscoveryApi',
    'ElementCollection',
    'ErrorApi',
    'ErrorBoundaryFallbackProps',
    'ErrorContext',
    'Extension',
    'ExternalRouteRef',
    'FeatureFlag',
    'FeatureFlagOutput',
    'FeatureFlagState',
    'FeatureFlagsApi',
    'FeatureFlagsHooks',
    'FeatureFlagsSaveOptions',
    'IconComponent',
    'IdentityApi',
    'OAuthApi',
    'OAuthRequestApi',
    'OAuthScope',
    'Observable',
    'Observer',
    'OpenIdConnectApi',
    'PendingAuthRequest',
    'PluginConfig',
    'PluginHooks',
    'PluginOutput',
    'ProfileInfo',
    'ProfileInfoApi',
    'RouteOptions',
    'RoutePath',
    'RouteRef',
    'SessionApi',
    'SessionState',
    'SignInPageProps',
    'SignInResult',
    'StorageApi',
    'StorageValueChange',
    'SubRouteRef',
    'Subscription',
    'TypesToApiRefs',
    'UserFlags',
    'alertApiRef',
    'appThemeApiRef',
    'attachComponentData',
    'auth0AuthApiRef',
    'configApiRef',
    'createApiFactory',
    'createApiRef',
    'createComponentExtension',
    'createExternalRouteRef',
    'createPlugin',
    'createReactExtension',
    'createRoutableExtension',
    'createRouteRef',
    'createSubRouteRef',
    'discoveryApiRef',
    'errorApiRef',
    'featureFlagsApiRef',
    'getComponentData',
    'githubAuthApiRef',
    'gitlabAuthApiRef',
    'googleAuthApiRef',
    'identityApiRef',
    'microsoftAuthApiRef',
    'oauth2ApiRef',
    'oauthRequestApiRef',
    'oidcAuthApiRef',
    'oktaAuthApiRef',
    'oneloginAuthApiRef',
    'samlAuthApiRef',
    'storageApiRef',
    'useApi',
    'useApiHolder',
    'useApp',
    'useElementFilter',
    'useRouteRef',
    'useRouteRefParams',
    'withApis',
  ],
};

const reverseSymbolTable = Object.entries(symbolTable).reduce(
  (table, [pkg, symbols]) => {
    for (const symbol of symbols) {
      table[symbol] = pkg;
    }
    return table;
  },
  {},
);

module.exports = (file, /** @type {import('jscodeshift').API} */ api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Grab the file comment from the first node in case the import gets removed
  const firstNodeComment = root.find(j.Program).get('body', 0).node.comments;

  // Find all import statements of @backstage/core
  const imports = root.find(j.ImportDeclaration, {
    source: {
      value: '@backstage/core',
    },
  });

  if (imports.size === 0) {
    return undefined;
  }

  // Check what style we're using for the imports, ' or "
  const useSingleQuote =
    root.find(j.ImportDeclaration).nodes()[0]?.source.extra.raw[0] === "'";

  // Then loop through all the import statement and collects each imported symbol
  const importedSymbols = imports.nodes().flatMap(node =>
    (node.specifiers || []).flatMap(specifier => ({
      name: specifier.imported.name, // The symbol we're importing
      local: specifier.local.name, // The local name, usually this is the same
    })),
  );

  // Now that we gathered all the imports we want to add, we get rid of the old one
  imports.remove();

  // The convert the imports into actual import statements
  const newImportStatements = importedSymbols.map(({ name, local }) => {
    const targetPackage = reverseSymbolTable[name];
    if (!targetPackage) {
      throw new Error(`No target package found for import of ${name}`);
    }

    return j.importDeclaration(
      [j.importSpecifier(j.identifier(name), j.identifier(local))],
      j.literal(targetPackage),
    );
  });

  // And add the new imports. `addImports` will take care of resolving duplicates
  addImports(root, newImportStatements);

  // Restore the initial file comment in case it got removed
  root.find(j.Program).get('body', 0).node.comments = firstNodeComment;

  return root.toSource({
    quote: useSingleQuote ? 'single' : 'double',
  });
};
