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

import { Strategy } from 'passport';
import { PassportOAuthAuthenticatorHelper } from './PassportOAuthAuthenticatorHelper';

class FailureStrategy extends Strategy {
  public override authenticate(_: any, __: any) {
    this.error(new Error('failure'));
  }
}

describe('PassportOAuthAuthenticatorHelper', () => {
  describe('start', () => {
    it('should gracefully handle errors if unable to start', async () => {
      const helper = PassportOAuthAuthenticatorHelper.from(
        new FailureStrategy(),
      );
      await expect(helper.start({} as any, {})).rejects.toThrow(
        'Authentication failed, failure',
      );
    });
  });

  describe('authenticate', () => {
    it('should gracefully handle errors if unable to authenticate', async () => {
      const helper = PassportOAuthAuthenticatorHelper.from(
        new FailureStrategy(),
      );
      await expect(helper.authenticate({} as any, {})).rejects.toThrow(
        'Authentication failed, failure',
      );
    });
  });
});
