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

const createAttemptJournal = jest.fn(
  (_options: Record<string, unknown>): unknown => ({ journal: true }),
);

jest.mock('../journal/knex', () => ({
  ...jest.requireActual('../journal/knex'),
  createAttemptJournal: (options: Record<string, unknown>) =>
    createAttemptJournal(options),
}));

import { createWiredAttemptJournal } from '../journal/wired';

describe('wired journal observability', () => {
  it('forwards the sink to the journal it builds', () => {
    const emit = (): void => {};
    const permissions = { authorize: jest.fn() };

    expect(
      createWiredAttemptJournal({ db: {} as never, permissions, emit }),
    ).toEqual({ journal: true });
    expect(createAttemptJournal).toHaveBeenLastCalledWith(
      expect.objectContaining({ emit }),
    );

    // Absent sink: no `emit` key at all, so the journal takes its no-op
    // default rather than a defined no-op.
    createWiredAttemptJournal({ db: {} as never, permissions });
    expect(createAttemptJournal.mock.lastCall?.[0]).not.toHaveProperty('emit');
  });
});
