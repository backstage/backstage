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

import { Observable } from '@backstage/types';
import { createApiRef } from '../system';

/**
 * Message handled by the {@link AlertApi}.
 *
 * @public
 * @deprecated Use `ToastApiMessage` from `@backstage/frontend-plugin-api` instead.
 */
export type AlertMessage = {
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  display?: 'permanent' | 'transient';
};

/**
 * The alert API is used to report alerts to the app and display them to the user.
 *
 * @public
 * @deprecated Use `ToastApi` from `@backstage/frontend-plugin-api` instead.
 */
export type AlertApi = {
  post(alert: AlertMessage): void;
  alert$(): Observable<AlertMessage>;
};

/**
 * API reference for the legacy alert API.
 *
 * @public
 * @deprecated Use `toastApiRef` from `@backstage/frontend-plugin-api` instead.
 */
export const alertApiRef = createApiRef<AlertApi>({ id: 'core.alert' });
