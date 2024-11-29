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

export const CACHE_CONTROL_NO_CACHE = 'no-store, max-age=0';
export const CACHE_CONTROL_MAX_CACHE = 'public, max-age=1209600'; // 14 days
export const CACHE_CONTROL_REVALIDATE_CACHE = 'no-cache'; // require revalidating cached responses before reuse them.
