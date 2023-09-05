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

export { examplePlugin } from './plugin';
// TODO: This should be an extension created & exported in the `plugin.tsx`
// YEAHHH most likely but there's no api(output) for it yet.
export { ExampleSidebarItem } from './ExampleSidebarItem';

export const a1 = null;
export const a2 = false;
export const a3 = true;
export const a4 = Symbol('b');
export const a5 = 3;
export const a6 = [];
