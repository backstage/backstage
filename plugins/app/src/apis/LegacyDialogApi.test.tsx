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

import { type LegacyDialogApi as LegacyDialogApiContract } from './legacyApiRefs';
import { LegacyDialogApi } from './LegacyDialogApi';

it('forwards open to v2 and rejects removed dialog methods', () => {
  const handle = { close: jest.fn(), update: jest.fn(), result: jest.fn() };
  const open = jest.fn().mockReturnValue(handle);
  const api: LegacyDialogApiContract = new LegacyDialogApi({ open });
  const element = <div>dialog</div>;
  expect(api.open(element)).toBe(handle);
  expect(open).toHaveBeenCalledWith(element);
  expect(() => api.show(element)).toThrow(
    'DialogApi.show is no longer supported',
  );
  expect(() => api.showModal(element)).toThrow(
    'DialogApi.showModal is no longer supported',
  );
  expect(open).toHaveBeenCalledTimes(1);
});
