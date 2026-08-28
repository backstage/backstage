/*
 * Copyright 2023 The Backstage Authors
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
import {
  coreExtensionData,
  createExtensionInput,
  createFrontendPlugin,
  PageBlueprint,
  SubPageBlueprint,
  useTranslationRef,
} from '@backstage/frontend-plugin-api';
import { Content } from '@backstage/core-components';
import SettingsIcon from '@material-ui/icons/Settings';
import { settingsRouteRef } from './plugin';

import { userSettingsTranslationRef as _userSettingsTranslationRef } from './translation';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-user-settings` instead.
 */
export const userSettingsTranslationRef = _userSettingsTranslationRef;

// These render the translated title reactively (re-rendering when the
// language changes), unlike the plain `title` strings below which are
// resolved once when the extension is constructed and used only as a
// static fallback (e.g. for consumers that need a plain string).
function SettingsPageTitle() {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return <>{t('settingsLayout.title')}</>;
}

function GeneralSettingsTitle() {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return <>{t('defaultSettingsPage.tabsTitle.general')}</>;
}

function AuthProvidersSettingsTitle() {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return <>{t('defaultSettingsPage.tabsTitle.authProviders')}</>;
}

function FeatureFlagsSettingsTitle() {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  return <>{t('defaultSettingsPage.tabsTitle.featureFlags')}</>;
}

const userSettingsPage = PageBlueprint.make({
  params: {
    path: '/settings',
    routeRef: settingsRouteRef,
    title: 'Settings',
    titleElement: <SettingsPageTitle />,
    icon: <SettingsIcon fontSize="inherit" />,
  },
});

const generalSettingsPage = SubPageBlueprint.make({
  name: 'general',
  params: {
    path: 'general',
    title: 'General',
    titleElement: <GeneralSettingsTitle />,
    loader: () =>
      import('./components/General').then(m => (
        <Content>
          <m.UserSettingsGeneral />
        </Content>
      )),
  },
});

const authProvidersSettingsPage = SubPageBlueprint.makeWithOverrides({
  name: 'auth-providers',
  inputs: {
    providerSettings: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
  },
  factory(originalFactory, { inputs }) {
    return originalFactory({
      path: 'auth-providers',
      title: 'Authentication Providers',
      titleElement: <AuthProvidersSettingsTitle />,
      loader: () =>
        import('./components/AuthProviders').then(m => (
          <Content>
            <m.UserSettingsAuthProviders
              providerSettings={inputs.providerSettings?.get(
                coreExtensionData.reactElement,
              )}
            />
          </Content>
        )),
    });
  },
});

const featureFlagsSettingsPage = SubPageBlueprint.make({
  name: 'feature-flags',
  params: {
    path: 'feature-flags',
    title: 'Feature Flags',
    titleElement: <FeatureFlagsSettingsTitle />,
    loader: () =>
      import('./components/FeatureFlags').then(m => (
        <Content>
          <m.UserSettingsFeatureFlags />
        </Content>
      )),
  },
});

/**
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'user-settings',
  title: 'Settings',
  icon: <SettingsIcon fontSize="inherit" />,
  info: { packageJson: () => import('../package.json') },
  extensions: [
    userSettingsPage,
    generalSettingsPage,
    authProvidersSettingsPage,
    featureFlagsSettingsPage,
  ],
  routes: {
    root: settingsRouteRef,
  },
});
