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

import { ScaffolderClient as _ScaffolderClient } from '@backstage/plugin-scaffolder-common';

/**
 * An API to interact with the scaffolder backend.
 *
 * @public
 * @deprecated use import from {@link @backstage/plugin-scaffolder-common#ScaffolderClient} instead as this has now been moved.
 */
export class ScaffolderClient extends _ScaffolderClient {}
