/*
 * Copyright 2021 The Backstage Authors
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

import { AnsiProcessor } from './AnsiProcessor';

describe('AnsiProcessor', () => {
  it('should process a single line', () => {
    const processor = new AnsiProcessor();
    expect(processor.process('foo\x1b[31mbar\x1b[39mbaz')).toEqual([
      {
        chunks: [
          {
            text: 'foo',
            modifiers: {},
          },
          {
            text: 'bar',
            modifiers: { foreground: 'red' },
          },
          {
            text: 'baz',
            modifiers: {},
          },
        ],
        text: 'foobarbaz',
        lineNumber: 1,
      },
    ]);

    expect(processor.process(`foo [32mbar[39m: baz`)).toEqual([
      {
        chunks: [
          {
            text: 'foo ',
            modifiers: {},
          },
          {
            text: 'bar',
            modifiers: { foreground: 'green' },
          },
          {
            text: ': baz',
            modifiers: {},
          },
        ],
        text: 'foo bar: baz',
        lineNumber: 1,
      },
    ]);
  });

  it('should process multiple lines', () => {
    const processor = new AnsiProcessor();
    expect(
      processor.process(`
a\x1b[34mb\x1b[39mc
x\x1b[44my\x1b[49mz
`),
    ).toEqual([
      { chunks: [{ text: '', modifiers: {} }], text: '', lineNumber: 1 },
      {
        chunks: [
          {
            text: 'a',
            modifiers: {},
          },
          {
            text: 'b',
            modifiers: { foreground: 'blue' },
          },
          {
            text: 'c',
            modifiers: {},
          },
        ],
        text: 'abc',
        lineNumber: 2,
      },
      {
        chunks: [
          {
            text: 'x',
            modifiers: {},
          },
          {
            text: 'y',
            modifiers: { background: 'blue' },
          },
          {
            text: 'z',
            modifiers: {},
          },
        ],
        text: 'xyz',
        lineNumber: 3,
      },
      { chunks: [{ text: '', modifiers: {} }], text: '', lineNumber: 4 },
    ]);
  });

  it('should carry state across lines', () => {
    const processor = new AnsiProcessor();
    expect(
      processor.process(`
a\x1b[45mb\x1b[35mc
x\x1b[39my\x1b[49mz`),
    ).toEqual([
      { chunks: [{ text: '', modifiers: {} }], text: '', lineNumber: 1 },
      {
        chunks: [
          {
            text: 'a',
            modifiers: {},
          },
          {
            text: 'b',
            modifiers: { background: 'magenta' },
          },
          {
            text: 'c',
            modifiers: { foreground: 'magenta', background: 'magenta' },
          },
        ],
        text: 'abc',
        lineNumber: 2,
      },
      {
        chunks: [
          {
            text: 'x',
            modifiers: { foreground: 'magenta', background: 'magenta' },
          },
          {
            text: 'y',
            modifiers: { background: 'magenta' },
          },
          {
            text: 'z',
            modifiers: {},
          },
        ],
        text: 'xyz',
        lineNumber: 3,
      },
    ]);
  });

  it('should carry forward state when appending lines', () => {
    const processor = new AnsiProcessor();
    const out1 = processor.process(`
a\x1b[36mb\x1b[3mc`);
    expect(out1).toEqual([
      { chunks: [{ text: '', modifiers: {} }], text: '', lineNumber: 1 },
      {
        chunks: [
          {
            text: 'a',
            modifiers: {},
          },
          {
            text: 'b',
            modifiers: { foreground: 'cyan' },
          },
          {
            text: 'c',
            modifiers: { foreground: 'cyan', italic: true },
          },
        ],
        text: 'abc',
        lineNumber: 2,
      },
    ]);

    const out2 = processor.process(`
a\x1b[36mb\x1b[3mc
x\x1b[39my\x1b[23mz`);
    expect(out2).toEqual([
      { chunks: [{ text: '', modifiers: {} }], text: '', lineNumber: 1 },
      {
        chunks: [
          {
            text: 'a',
            modifiers: {},
          },
          {
            text: 'b',
            modifiers: { foreground: 'cyan' },
          },
          {
            text: 'c',
            modifiers: { foreground: 'cyan', italic: true },
          },
        ],
        text: 'abc',
        lineNumber: 2,
      },
      {
        chunks: [
          {
            text: 'x',
            modifiers: { foreground: 'cyan', italic: true },
          },
          {
            text: 'y',
            modifiers: { italic: true },
          },
          {
            text: 'z',
            modifiers: {},
          },
        ],
        text: 'xyz',
        lineNumber: 3,
      },
    ]);

    // Verifies that we appended rather than reprocessed
    expect(out1[0]).toBe(out2[0]);
  });
});
