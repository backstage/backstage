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
import { groupNotifications } from './groupNotifications';

describe('groupNotifications', () => {
  const topic = 'topic';

  const logger = mockServices.logger.mock();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([{}, null, undefined])(
    'returns undefined and logs warning for invalid payload %p',
    eventPayload => {
      const result = groupNotifications({
        event: { topic, eventPayload },
        logger,
      });
      expect(result).toBeUndefined();
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Received invalid event payload'),
      );
    },
  );

  it('returns undefined and logs info for no valid notifications', () => {
    const result = groupNotifications({
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

  it('partitions valid notifications into upserts and deletes', () => {
    const eventPayload = {
      value: [
        { changeType: 'updated', resource: 'users/u1' },
        { changeType: 'updated', resource: 'users/u2' },
        { changeType: 'deleted', resource: 'users/u3' },
        { changeType: 'updated', resource: 'groups/g1' },
        { changeType: 'updated', resource: 'groups/g2' },
        { changeType: 'deleted', resource: 'groups/g3' },
      ],
    };
    const result = groupNotifications({
      event: { topic, eventPayload },
      logger,
    });
    expect(result).toEqual({
      upsertNotifications: eventPayload.value
        .slice(0, 2)
        .concat(eventPayload.value.slice(3, 5)),
      deleteNotifications: [eventPayload.value[2], eventPayload.value[5]],
    });
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('handles mixed valid and invalid notifications', () => {
    const eventPayload = {
      value: [
        { changeType: 'updated', resource: 'users/u1' },
        { changeType: 'foo', resource: 'users/u2' },
      ],
    };
    const result = groupNotifications({
      event: { topic, eventPayload },
      logger,
    });
    expect(result).toEqual({
      upsertNotifications: [eventPayload.value[0]],
      deleteNotifications: [],
    });
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Received 1 invalid change notifications'),
    );
  });

  it('handles case-insensitive changeType and resourceType', () => {
    const eventPayload = {
      value: [
        { changeType: 'Updated', resource: 'Users/U1' },
        { changeType: 'UPDATED', resource: 'Groups/G2' },
        { changeType: 'deleted', resource: 'users/u3' },
      ],
    };
    const result = groupNotifications({
      event: { topic, eventPayload },
      logger,
    });

    expect(result).toEqual({
      upsertNotifications: [eventPayload.value[0], eventPayload.value[1]],
      deleteNotifications: [eventPayload.value[2]],
    });
  });

  it('routes valid notifications for resource types other than users and groups', () => {
    const result = groupNotifications({
      event: {
        topic,
        eventPayload: {
          value: [
            { changeType: 'updated', resource: 'teams/t1' },
            { changeType: 'deleted', resource: 'teams/t2' },
          ],
        },
      },
      logger,
    });

    expect(result).toEqual({
      upsertNotifications: [{ changeType: 'updated', resource: 'teams/t1' }],
      deleteNotifications: [{ changeType: 'deleted', resource: 'teams/t2' }],
    });
  });
});
