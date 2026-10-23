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

import { detectAgents, resolveTargetAgents } from './detectAgent';

describe('detectAgent', () => {
  it('detects agents from documented harness environment variables only', () => {
    expect(detectAgents({ CLAUDECODE: '1' })).toEqual(['claude-code']);
    expect(detectAgents({ CURSOR_AGENT: '1' })).toEqual(['cursor']);
    expect(detectAgents({ CLAUDECODE: '1', CURSOR_AGENT: '1' })).toEqual([
      'claude-code',
      'cursor',
    ]);
    expect(detectAgents({ CLAUDECODE: '0' })).toEqual([]);
    // Codex has no documented variable; CODEX_SANDBOX is only set in the macOS sandbox.
    expect(detectAgents({ CODEX_SANDBOX: 'seatbelt' })).toEqual([]);
    expect(detectAgents({})).toEqual([]);
  });

  it('prefers explicit --agent values and fails when nothing is known', () => {
    expect(
      resolveTargetAgents(['codex', 'cursor'], { CLAUDECODE: '1' }),
    ).toEqual(['codex', 'cursor']);
    expect(resolveTargetAgents([], { CLAUDECODE: '1' })).toEqual([
      'claude-code',
    ]);
    expect(() => resolveTargetAgents([], {})).toThrow(/--agent/);
  });
});
