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

import { mockServices } from '@backstage/backend-test-utils';
import { parseEvents } from './parseEvents';

describe('parseEvents', () => {
  const topic = 'topic';

  const logger = mockServices.logger.mock();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined and logs warning for invalid payload', () => {
    const result = parseEvents({
      event: { topic, eventPayload: {} },
      logger,
    });
    expect(result).toBeUndefined();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received invalid event payload'),
    );
  });

  it('returns undefined and logs info for no valid notifications', () => {
    const result = parseEvents({
      event: {
        topic,
        eventPayload: { value: [{ changeType: 'foo', resource: 'bar' }] },
      },
      logger,
    });
    expect(result).toBeUndefined();
    expect(logger.info).toHaveBeenCalledWith(
      'No valid change notifications to process',
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received 1 invalid change notifications'),
    );
  });

  it('partitions valid notifications correctly', () => {
    const eventPayload = {
      value: [
        { changeType: 'created', resource: 'users/u1' },
        { changeType: 'updated', resource: 'users/u2' },
        { changeType: 'deleted', resource: 'users/u3' },
        { changeType: 'created', resource: 'groups/g1' },
        { changeType: 'updated', resource: 'groups/g2' },
        { changeType: 'deleted', resource: 'groups/g3' },
      ],
    };
    const result = parseEvents({
      event: { topic, eventPayload },
      logger,
    });
    expect(result).toEqual({
      deletedUsers: [
        { changeType: 'deleted', resourceType: 'users', resourceId: 'u3' },
      ],
      deletedGroups: [
        { changeType: 'deleted', resourceType: 'groups', resourceId: 'g3' },
      ],
      upsertedUsers: [
        { changeType: 'created', resourceType: 'users', resourceId: 'u1' },
        { changeType: 'updated', resourceType: 'users', resourceId: 'u2' },
      ],
      upsertedGroups: [
        { changeType: 'created', resourceType: 'groups', resourceId: 'g1' },
        { changeType: 'updated', resourceType: 'groups', resourceId: 'g2' },
      ],
    });
  });

  it('handles mixed valid and invalid notifications', () => {
    const eventPayload = {
      value: [
        { changeType: 'created', resource: 'users/u1' },
        { changeType: 'foo', resource: 'users/u2' }, // invalid changeType
        { changeType: 'updated', resource: 'invalidformat' }, // invalid resource
      ],
    };
    const result = parseEvents({
      event: { topic, eventPayload },
      logger,
    });
    expect(result).toEqual({
      deletedUsers: [],
      deletedGroups: [],
      upsertedUsers: [
        { changeType: 'created', resourceType: 'users', resourceId: 'u1' },
      ],
      upsertedGroups: [],
    });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received 2 invalid change notifications'),
    );
  });

  it('handles case-insensitive changeType and resourceType', () => {
    const eventPayload = {
      value: [
        { changeType: 'Created', resource: 'Users/U1' },
        { changeType: 'UPDATED', resource: 'Groups/G2' },
        { changeType: 'deleted', resource: 'users/u3' },
      ],
    };
    const result = parseEvents({
      event: { topic, eventPayload },
      logger,
    });
    expect(result).toEqual({
      deletedUsers: [
        { changeType: 'deleted', resourceType: 'users', resourceId: 'u3' },
      ],
      deletedGroups: [],
      upsertedUsers: [
        { changeType: 'created', resourceType: 'users', resourceId: 'u1' },
      ],
      upsertedGroups: [
        { changeType: 'updated', resourceType: 'groups', resourceId: 'g2' },
      ],
    });
  });
});
