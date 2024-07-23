/*
 * Copyright 2022 The Backstage Authors
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

import { ServiceFactoryTester } from '@backstage/backend-test-utils';
import { redactionsServiceFactory } from './redactionServiceFactory';

describe('redactionServiceFactory', () => {
  it('should redact nothing without added redactions', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    expect(redactions.redact('')).toBe('');
    expect(redactions.redact('x')).toBe('x');
    expect(redactions.redact('xyz')).toBe('xyz');
    expect(redactions.redact('x y z')).toBe('x y z');
    expect(redactions.redact('_')).toBe('_');
    expect(redactions.redact('\n')).toBe('\n');
  });

  it('should redact added redactions', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    expect(redactions.redact('xyz')).toBe('xyz');
    redactions.addRedactions(['xyz']);
    expect(redactions.redact('xyz')).toBe('***');
    expect(redactions.redact('axyzb')).toBe('a***b');
    expect(redactions.redact('.xyz')).toBe('.***');
    expect(redactions.redact('xyz.')).toBe('***.');
    expect(redactions.redact('.xyz.')).toBe('.***.');
    expect(redactions.redact('xyz.xyz')).toBe('***.***');
    expect(redactions.redact('xyzxyz')).toBe('******');
  });

  it('should prioritize earlier redactions', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    redactions.addRedactions(['xy']);
    redactions.addRedactions(['xyz']);
    expect(redactions.redact('xyzxy')).toBe('***z***');
    expect(redactions.redact('xyzxyz')).toBe('***z***z');
  });

  it('should ignore whitespace in redactions', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    redactions.addRedactions(['abc\n\n']);
    redactions.addRedactions([' xyz ']);
    redactions.addRedactions(['\t\n123']);
    expect(redactions.redact('abcxyz123')).toBe('*********');
  });

  it('should ignore redactions that are too short', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    redactions.addRedactions(['']);
    redactions.addRedactions(['x']);
    expect(redactions.redact(' x')).toBe(' x');
  });

  it('should escape regex characters in redactions', async () => {
    const redactions = await ServiceFactoryTester.from(
      redactionsServiceFactory,
    ).get();

    redactions.addRedactions(['^(|)[^\\s]$']);
    expect(redactions.redact('^(|)[^\\s]$')).toBe('***');
  });
});
