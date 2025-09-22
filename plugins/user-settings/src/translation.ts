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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const userSettingsTranslationRef = createTranslationRef({
  id: 'user-settings',
  messages: {
    languageToggle: {
      title: 'Language',
      description: 'Change the language',
      select: 'Select language {{language}}',
    },
    themeToggle: {
      title: 'Theme',
      description: 'Change the theme mode',
      select: 'Select {{theme}}',
      selectAuto: 'Select Auto Theme',
      names: {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
      },
    },
    signOutMenu: {
      title: 'Sign Out',
      moreIconTitle: 'more',
    },
    pinToggle: {
      title: 'Pin Sidebar',
      description: 'Prevent the sidebar from collapsing',
      switchTitles: {
        unpin: 'Unpin Sidebar',
        pin: 'Pin Sidebar',
      },
      ariaLabelTitle: 'Pin Sidebar Switch',
    },
    identityCard: {
      title: 'Backstage Identity',
      noIdentityTitle: 'No Backstage Identity',
      userEntity: 'User Entity',
      ownershipEntities: 'Ownership Entities',
    },
    defaultProviderSettings: {
      description:
        'Provides authentication towards {{provider}} APIs and identities',
    },
    emptyProviders: {
      title: 'No Authentication Providers',
      description:
        'You can add Authentication Providers to Backstage which allows you to use these providers to authenticate yourself.',
      action: {
        title:
          'Open app-config.yaml and make the changes as highlighted below:',
        readMoreButtonTitle: 'Read More',
      },
    },
    providerSettingsItem: {
      title: {
        signIn: 'Sign in to {{title}}',
        signOut: 'Sign out from {{title}}',
      },
      buttonTitle: {
        signIn: 'Sign in',
        signOut: 'Sign out',
      },
    },
    authProviders: {
      title: 'Available Providers',
    },
    defaultSettingsPage: {
      tabsTitle: {
        general: 'General',
        authProviders: 'Authentication Providers',
        featureFlags: 'Feature Flags',
      },
    },
    featureFlags: {
      title: 'Feature Flags',
      description: 'Please refresh the page when toggling feature flags',
      emptyFlags: {
        title: 'No Feature Flags',
        description:
          'Feature Flags make it possible for plugins to register features in Backstage for users to opt into. You can use this to split out logic in your code for manual A/B testing, etc.',
        action: {
          title:
            'An example for how to add a feature flag is highlighted below:',
          readMoreButtonTitle: 'Read More',
        },
      },
      filterTitle: 'Filter',
      clearFilter: 'Clear filter',
      flagItem: {
        title: {
          disable: 'Disable',
          enable: 'Enable',
        },
        subtitle: {
          registeredInApplication: 'Registered in the application',
          registeredInPlugin: 'Registered in {{pluginId}} plugin',
        },
      },
    },
    settingsLayout: {
      title: 'Settings',
    },
    sidebarTitle: 'Settings',
    profileCard: {
      title: 'Profile',
    },
    appearanceCard: {
      title: 'Appearance',
    },
  },
});
