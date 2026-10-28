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

import { LegacyDialogApi } from './LegacyDialogApi';

it('forwards open to the supplied v2 API and preserves its handle', () => {
  const handle = { close: jest.fn(), update: jest.fn(), result: jest.fn() };
  const open = jest.fn().mockReturnValue(handle);
  const api = new LegacyDialogApi({ open });
  const element = <div>dialog</div>;
  expect(api.open(element)).toBe(handle);
  expect(open).toHaveBeenCalledWith(element);
});
