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
import { DefaultRedactionService } from './DefaultRedactionService';

describe('DefaultRedactionService', () => {
  it('should redact specified patterns', () => {
    const service = DefaultRedactionService.create(['secret', 'password']);
    const result = service.redact({ input: 'This is a secret and a password' });
    expect(result).toBe('This is a REDACTED and a REDACTED');
  });

  it('should add new redaction patterns', () => {
    const service = DefaultRedactionService.create(['secret']);
    service.addRedaction({ pattern: 'password' });
    const result = service.redact({ input: 'This is a secret and a password' });
    expect(result).toBe('This is a REDACTED and a REDACTED');
  });

  it('should return all redaction patterns', () => {
    const service = DefaultRedactionService.create(['secret', 'password']);
    const redactions = Array.from(service.getRedactions());
    expect(redactions).toEqual(['secret', 'password']);
  });

  it('should handle no redactions gracefully', () => {
    const service = DefaultRedactionService.create();
    const result = service.redact({ input: 'This is a test' });
    expect(result).toBe('This is a test');
  });

  it('should handle empty input gracefully', () => {
    const service = DefaultRedactionService.create(['secret']);
    const result = service.redact({ input: '' });
    expect(result).toBe('');
  });

  it('should not redact if pattern is not found', () => {
    const service = DefaultRedactionService.create(['secret']);
    const result = service.redact({ input: 'This is a test' });
    expect(result).toBe('This is a test');
  });
});
