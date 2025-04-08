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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Settings } from 'luxon';

// TS still thinks that methods can return null / placeholders, but we still want to throw as soon as possible when things go wrong
Settings.throwOnInvalid = true;

TestDatabases.setDefaults({
  ids: ['MYSQL_8', 'POSTGRES_16', 'POSTGRES_12', 'SQLITE_3'],
});
