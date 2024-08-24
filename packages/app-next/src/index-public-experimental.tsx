/*
 * Copyright 2020 The Backstage Authors
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

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookieAuthRedirect } from '@backstage/plugin-auth-react';
import { createApp } from '@backstage/frontend-app-api';
import { signInPageOverrides } from './overrides/SignInPage';
import {
  coreExtensionData,
  createExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';

const authRedirectExtension = createExtension({
  namespace: 'app',
  name: 'layout',
  attachTo: { id: 'app/root', input: 'children' },
  output: [coreExtensionData.reactElement],
  factory: () => [coreExtensionData.reactElement(<CookieAuthRedirect />)],
});

const app = createApp({
  features: [
    signInPageOverrides,
    createExtensionOverrides({
      extensions: [authRedirectExtension],
    }),
  ],
});

ReactDOM.createRoot(document.getElementById('root')!).render(app.createRoot());
