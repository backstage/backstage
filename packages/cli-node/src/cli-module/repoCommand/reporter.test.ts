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

import { createReporter } from './reporter';

const ansi = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*[A-Za-z]`, 'g');

function setup(options: { verbose: boolean; isTTY: boolean }) {
  const writes = new Array<string>();
  const reporter = createReporter({
    ...options,
    write: text => writes.push(text),
  });
  const strip = () => writes.join('').replace(ansi, '');
  return { reporter, strip, writes };
}

describe('createReporter', () => {
  it('prints one line per finished package without a terminal', () => {
    const { reporter, strip } = setup({ verbose: false, isTTY: false });
    reporter.begin(['a', 'b']);
    reporter.onStart('a');
    reporter.onOutput('a', Buffer.from('hidden\n'));
    reporter.onFinish('a', 'PASS');
    reporter.onFinish('b', 'INTERRUPTED');
    reporter.end();
    expect(strip()).toBe('PASS a (1/2)\nINTERRUPTED b (2/2)\n');
  });

  it('prefixes streamed output with the package name in verbose mode', () => {
    const { reporter, strip } = setup({ verbose: true, isTTY: true });
    reporter.begin(['a']);
    reporter.onOutput('a', Buffer.from('one\ntw'));
    reporter.onOutput('a', Buffer.from('o\nthree'));
    reporter.onFinish('a', 'FAIL');
    expect(strip()).toBe('[a] one\n[a] two\n[a] three\n[a] FAIL\n');
  });

  it('redraws a live view in place on a terminal', () => {
    const { reporter, strip, writes } = setup({ verbose: false, isTTY: true });
    reporter.begin(['a', 'b', 'c']);
    reporter.onStart('a');
    reporter.onStart('b');
    reporter.onFinish('a', 'PASS');
    reporter.onFinish('b', 'FAIL');
    reporter.end();

    // Each redraw moves the cursor up over the previous block
    expect(
      writes.some(t => t.startsWith('\x1b[') && t.endsWith('A\x1b[0J')),
    ).toBe(true);
    const text = strip();
    expect(text).toContain('1 passed · 0 failed · 1 running · 1 queued');
    expect(text).toContain('FAIL b');
    expect(text).not.toContain('PASS a');
    expect(text).toContain('1 passed · 1 failed · 0 running · 1 queued');
  });
});
