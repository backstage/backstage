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

/**
 * @deprecated AlertApi is deprecated. Use ToastApi from `@backstage/frontend-plugin-api` instead.
 *
 * ToastApi provides richer notification features including title/description,
 * action links, custom icons, per-toast timeout control, and programmatic dismiss.
 *
 * @example
 * ```typescript
 * // Before (AlertApi)
 * import { alertApiRef } from '@backstage/core-plugin-api';
 * alertApi.post({ message: 'Saved!', severity: 'success', display: 'transient' });
 *
 * // After (ToastApi)
 * import { toastApiRef } from '@backstage/frontend-plugin-api';
 * toastApi.post({ title: 'Saved!', status: 'success', timeout: 5000 });
 * ```
 */
export {
  type AlertApi,
  type AlertMessage,
  alertApiRef,
} from '@backstage/frontend-plugin-api';
