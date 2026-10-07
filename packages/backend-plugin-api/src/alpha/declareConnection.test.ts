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
import { declareConnection } from './declareConnection';

describe('declareConnection', () => {
  it('forwards declarations and rejects unsupported registration environments', () => {
    const env = {
      registerInit: jest.fn(),
      registerExtensionPoint: jest.fn(),
    };
    const registration = {
      type: 'github',
      required: true,
      description: 'Reads repository metadata',
    };

    expect(() => declareConnection(env, registration)).toThrow(
      'the provided registration points object does not support registerConnection',
    );

    const internalEnv = { ...env, registerConnection: jest.fn() };
    declareConnection(internalEnv, registration);
    expect(internalEnv.registerConnection).toHaveBeenCalledTimes(1);
    expect(internalEnv.registerConnection).toHaveBeenCalledWith(registration);
  });
});
