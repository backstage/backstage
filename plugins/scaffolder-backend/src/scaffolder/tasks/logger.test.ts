/*
 * Copyright 2025 The Backstage Authors
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

import { WinstonLogger } from './logger';
import { MESSAGE } from 'triple-beam';

describe('WinstonLogger', () => {
  describe('redacter', () => {
    describe('add method', () => {
      it('should handle null and undefined values in newRedactions without crashing', () => {
        const { add, format } = WinstonLogger.redacter();

        expect(() => {
          add([null as any, undefined as any, 'valid-secret']);
        }).not.toThrow();

        const testObj = {
          level: 'info',
          message: 'This contains valid-secret and should be redacted',
          [MESSAGE]: 'This contains valid-secret and should be redacted',
        };
        const result = format.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe(
          'This contains *** and should be redacted',
        );
      });

      it('should skip empty and single character redactions', () => {
        const { add, format } = WinstonLogger.redacter();

        add(['', 'x', 'valid-secret-123']);

        // MESSAGE symbol is where Winston stores the formatted message for redaction
        const testObj = {
          level: 'info',
          message: 'This contains valid-secret-123 and should be redacted',
          [MESSAGE]: 'This contains valid-secret-123 and should be redacted',
        };

        const result = format.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe(
          'This contains *** and should be redacted',
        );
      });

      it('should trim whitespace from redactions', () => {
        const { add, format } = WinstonLogger.redacter();

        add(['  secret-with-spaces  \n', '  another-secret\t']);

        const testObj = {
          level: 'info',
          message: 'This contains secret-with-spaces and another-secret',
          [MESSAGE]: 'This contains secret-with-spaces and another-secret',
        };

        const result = format.transform(testObj);
        expect((result as any)?.[MESSAGE]).toBe('This contains *** and ***');
      });
    });
  });
});
