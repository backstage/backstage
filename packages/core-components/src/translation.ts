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
        subtitle:
          'Enter your own User ID and credentials.\n This selection will not be stored.',
        userId: 'User ID',
        tokenInvalid: 'Token is not a valid OpenID Connect JWT Token',
        continue: 'Continue',
        idToken: 'ID Token (optional)',
      },
      guestProvider: {
        title: 'Guest',
        subtitle:
          'Enter as a Guest User.\n You will not have a verified identity, meaning some features might be unavailable.',
        enter: 'Enter',
      },
    },
    skipToContent: 'Skip to content',
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
      showMoreDetails: 'Show more details',
      showLessDetails: 'Show less details',
    },
    emptyState: {
      missingAnnotation: {
        title: 'Missing Annotation',
        actionTitle:
          'Add the annotation to your component YAML as shown in the highlighted example below:',
        readMore: 'Read more',
      },
    },
    supportConfig: {
      default: {
        title: 'Support Not Configured',
        linkTitle: 'Add `app.support` config key',
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
    supportButton: {
      title: 'Support',
      close: 'Close',
    },
    table: {
      filter: {
        title: 'Filters',
        clearAll: 'Clear all',
        placeholder: 'All results',
      },
      body: {
        emptyDataSourceMessage: 'No records to display',
      },
      pagination: {
        firstTooltip: 'First Page',
        labelDisplayedRows: '{from}-{to} of {count}',
        labelRowsSelect: 'rows',
        lastTooltip: 'Last Page',
        nextTooltip: 'Next Page',
        previousTooltip: 'Previous Page',
      },
      toolbar: {
        search: 'Filter',
      },
    },
    alertDisplay: {
      message_one: '({{ count }} older message)',
      message_other: '({{ count }} older messages)',
    },
    autoLogout: {
      stillTherePrompt: {
        title: 'Logging out due to inactivity',
        buttonText: "Yes! Don't log me out",
      },
    },
    proxiedSignInPage: {
      title:
        'You do not appear to be signed in. Please try reloading the browser page.',
    },
  },
});
