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
export const coreComponentsTranslationRef = createTranslationRef({
  id: 'core-components',
  messages: {
    signIn: {
      title: 'Sign In',
      loginFailed: 'Login failed',
      customProvider: {
        title: 'Custom User',
        subtitle: 'Enter your own User ID and credentials.',
        subtitle2: 'This selection will not be stored.',
        userId: 'User ID',
        tokenInvalid: 'Token is not a valid OpenID Connect JWT Token',
        continue: 'Continue',
        idToken: 'ID Token (optional)',
      },
      guestProvider: {
        title: 'Guest',
        subtitle: 'Enter as a Guest User.',
        description:
          'You will not have a verified identity, meaning some features might be unavailable.',
        enter: 'Enter',
      },
    },
    sidebar: {
      shipToContent: 'Skip to content',
      starredIntroText:
        'Fun fact! As you explore all the awesome plugins in Backstage, you can actually pin them to this side nav.Keep an eye out for the little star icon (⭐) next to the plugin name and give it a click!',
      recentlyViewedIntroText:
        'And your recently viewed plugins will pop up here!',
      dismiss: 'Dismiss',
    },
    copyTextButton: {
      tooltipText: 'Text copied to clipboard',
    },
    simpleStepper: {
      reset: 'Reset',
      finish: 'Finish',
      next: 'Next',
      skip: 'Skip',
      back: 'Back',
    },
    errorPage: {
      subtitle: 'ERROR {{status}}: {{statusMessage}}',
      title: 'Looks like someone dropped the mic!',
      goBack: 'Go back',
      orPlease: '... or please ',
      contactSupport: 'contact support',
      isBug: 'if you think this is a bug.',
    },
    emptyState: {
      missingAnnotation: {
        title: 'Missing Annotation',
        actionTitle:
          'Add the annotation to your component YAML as shown in the highlighted example below:',
        readMore: 'Read more',
        descriptionPrefix_one: 'The annotation ',
        descriptionPrefix_other: 'The annotations ',
        descriptionSuffix_one:
          ' is missing. You need to add the annotation to your component if you want to enable this tool.',
        descriptionSuffix_other:
          ' are missing. You need to add the annotations to your component if you want to enable this tool.',
      },
    },
    supportConfig: {
      title: 'Support Not Configured',
      links: {
        title: 'Add `app.support` config key',
      },
    },
    errorBoundary: {
      title: 'Please contact {{slackChannel}} for help.',
    },
    oauthRequestDialog: {
      title: 'Login Required',
      authRedirectTitle: 'This will trigger a http redirect to OAuth Login.',
      login: 'Log in',
      rejectAll: 'Reject All',
    },
    link: {
      openNewWindow: 'Opens in a new window',
    },
    supportButton: {
      title: 'Support',
      close: 'Close',
    },
    table: {
      filter: {
        title: 'Filters',
        clearAll: 'Clear all',
      },
    },
    alertDisplay: {
      message_one: '({{ num }} older message)',
      message_other: '({{ num }} older messages)',
    },
    autoLogout: {
      stillTherePrompt: {
        title: 'Logging out due to inactivity',
        description: 'You are about to be disconnected in',
        second_one: 'second',
        second_other: 'seconds',
        descriptionSuffix: 'Are you still there?',
        buttonText: "Yes! Don't log me out",
      },
    },
    proxiedSignInPage: {
      title:
        'You do not appear to be signed in. Please try reloading the browser page.',
    },
  },
});
