/*
 * Copyright 2024 The Backstage Authors
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

import { mockApis } from './mockApis';

describe('mockApis', () => {
  describe('config', () => {
    const data = { backend: { baseUrl: 'http://test.com' } };

    it('can create an instance and make assertions on it', () => {
      const empty = mockApis.config();
      const notEmpty = mockApis.config({ data });
      expect(empty.getOptional('backend.baseUrl')).toBeUndefined();
      expect(empty.getOptional).toHaveBeenCalledTimes(1);
      expect(notEmpty.getOptional('backend.baseUrl')).toEqual(
        'http://test.com',
      );
      expect(notEmpty.getOptional).toHaveBeenCalledTimes(1);
    });

    it('can create a mock and make assertions on it', async () => {
      const mock = mockApis.config.mock({ getString: () => 'replaced' });
      expect(mock.getString('a')).toEqual('replaced');
      expect(mock.getString).toHaveBeenCalledTimes(1);
    });
  });
});
