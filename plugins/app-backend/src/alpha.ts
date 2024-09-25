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

<<<<<<< HEAD
import { appPlugin } from './service/appPlugin';

/** @alpha */
const _appPlugin = appPlugin;
export default _appPlugin;
=======
/**
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 */
export { appPlugin as default } from './service/appPlugin';
>>>>>>> 9306aecd7c324 (Phase 1 deprecation for plugin-app-back-end)
