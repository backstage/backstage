/*
 * Copyright 2026 The Backstage Authors
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

import { isExternalTarget as classifyTarget } from '@internal/frontend';

/**
 * Whether a target is a browser-owned URL rather than an app-relative path.
 * This classifies targets without checking whether their scheme is safe.
 * Use AppHistoryApi.createHref before passing a target to the browser.
 *
 * @public
 */
export const isExternalTarget: (to: string) => boolean = classifyTarget;
