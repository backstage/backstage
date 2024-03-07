import { validatePayload, validateRecipients } from './validation';

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
describe('validateRecipients', () => {
  it('handles empty recipients', () => {
    expect(validateRecipients(undefined)).toBeUndefined();
    expect(validateRecipients({})).toBeUndefined();
    expect(validateRecipients('')).toBeUndefined();
    expect(validateRecipients('{"type": "broadcast"}')).toBeUndefined();
  });

  it('handles broadcast', () => {
    expect(validateRecipients({ type: 'broadcast' })).toEqual({
      type: 'broadcast',
    });
    expect(validateRecipients({ type: 'broadcast', foo: 'bar' })).toEqual({
      type: 'broadcast',
    });
    expect(
      validateRecipients({
        type: 'broadcast',
        entityRef: 'user:default/why-not',
      }),
    ).toEqual({
      type: 'broadcast',
      entityRef: 'user:default/why-not',
    });
  });

  it('handles resource entity', () => {
    expect(validateRecipients({ type: 'entity' })).toEqual({
      type: 'entity',
      // missing entityRef - left up to the NotificationsService to fail
    });
    expect(validateRecipients({ type: 'entity', foo: 'bar' })).toEqual({
      type: 'entity',
    });
    expect(
      validateRecipients({
        type: 'entity',
        entityRef: 'user:default/why-not',
      }),
    ).toEqual({
      type: 'entity',
      entityRef: 'user:default/why-not',
    });
    expect(() =>
      validateRecipients({
        type: 'entity',
        entityRef: 'invalid',
      }),
    ).toThrow();
  });
});

describe('validatePayload', () => {
  it('handles missing payload', () => {
    expect(validatePayload(undefined)).toBeUndefined();
    expect(validatePayload('')).toBeUndefined();
    expect(validatePayload('{}')).toBeUndefined();
  });

  it('handles unknown key in the payload', () => {
    expect(validatePayload({ title: 'title', foo: 'bar' })).toBeUndefined();
  });

  it('handles all known keys in the payload', () => {
    expect(
      validatePayload({
        title: 'title',
        description: 'my-description',
        link: '/foo/bar',
        severity: 'normal',
        topic: 'my-topic',
        scope: 'my-scope',
        icon: 'an-icon-ref',
      }),
    ).toEqual({
      title: 'title',
      description: 'my-description',
      link: '/foo/bar',
      severity: 'normal',
      topic: 'my-topic',
      scope: 'my-scope',
      icon: 'an-icon-ref',
    });
  });

  it('handles all missing keys in the payload', () => {
    expect(
      validatePayload({
        title: 'title',
      }),
    ).toEqual({
      title: 'title',
    });
  });

  it('handles non-string values missing keys in the payload', () => {
    expect(
      validatePayload({
        title: 'title',
        description: { foo: 'bar' },
      }),
    ).toBeUndefined();
  });
});
