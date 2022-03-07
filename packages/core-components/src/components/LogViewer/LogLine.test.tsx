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

import { AnsiLine, ChunkModifiers } from './AnsiProcessor';
import {
  calculateHighlightedChunks,
  findSearchResults,
  getModifierClasses,
} from './LogLine';

describe('getModifierClasses', () => {
  const classes = {
    modifierBold: 'bold',
    modifierItalic: 'italic',
    modifierUnderline: 'underline',
    modifierForegroundBlack: 'black',
    modifierForegroundRed: 'red',
    modifierForegroundGreen: 'green',
    modifierForegroundYellow: 'yellow',
    modifierForegroundBlue: 'blue',
    modifierForegroundMagenta: 'magenta',
    modifierForegroundCyan: 'cyan',
    modifierForegroundWhite: 'white',
    modifierForegroundGrey: 'grey',
    modifierBackgroundBlack: 'bg-black',
    modifierBackgroundRed: 'bg-red',
    modifierBackgroundGreen: 'bg-green',
    modifierBackgroundYellow: 'bg-yellow',
    modifierBackgroundBlue: 'bg-blue',
    modifierBackgroundMagenta: 'bg-magenta',
    modifierBackgroundCyan: 'bg-cyan',
    modifierBackgroundWhite: 'bg-white',
    modifierBackgroundGrey: 'bg-grey',
  };
  const curried = (modifiers: ChunkModifiers) =>
    getModifierClasses(
      classes as Parameters<typeof getModifierClasses>[0],
      modifiers,
    );

  it('should transform modifiers to classes', () => {
    expect(curried({})).toEqual(undefined);
    expect(curried({ bold: true })).toEqual('bold');
    expect(curried({ italic: true })).toEqual('italic');
    expect(curried({ underline: true })).toEqual('underline');
    expect(curried({ foreground: 'black' })).toEqual('black');
    expect(curried({ background: 'black' })).toEqual('bg-black');
    expect(
      curried({
        bold: true,
        italic: true,
        underline: true,
        foreground: 'red',
        background: 'red',
      }),
    ).toEqual('bold italic underline red bg-red');
  });
});

describe('findSearchResults', () => {
  it('should not return results if there is no match', () => {
    expect(findSearchResults('Foo', 'Bar')).toEqual(undefined);
    expect(findSearchResults('Foo Bar', 'oof')).toEqual(undefined);
    expect(findSearchResults('Foo Bar', '')).toEqual(undefined);
    expect(findSearchResults('', '')).toEqual(undefined);
    expect(findSearchResults('', 'Foo')).toEqual(undefined);
  });

  it('should find result indices', () => {
    expect(findSearchResults('Foo', 'Foo')).toEqual([{ start: 0, end: 3 }]);
    expect(findSearchResults('Foo', 'o')).toEqual([
      { start: 1, end: 2 },
      { start: 2, end: 3 },
    ]);
    expect(findSearchResults('FooBarBaz', 'Bar')).toEqual([
      { start: 3, end: 6 },
    ]);
    expect(findSearchResults('Foo Bar Baz', ' ')).toEqual([
      { start: 3, end: 4 },
      { start: 7, end: 8 },
    ]);
    expect(findSearchResults('FooBarBazBarFoo', 'Bar')).toEqual([
      { start: 3, end: 6 },
      { start: 9, end: 12 },
    ]);
    expect(findSearchResults('FooBarBazBarFoo', 'Foo')).toEqual([
      { start: 0, end: 3 },
      { start: 12, end: 15 },
    ]);
  });

  it('should not overlap search results', () => {
    expect(findSearchResults('aaa', 'aa')).toEqual([{ start: 0, end: 2 }]);
    expect(findSearchResults('aaaa', 'aa')).toEqual([
      { start: 0, end: 2 },
      { start: 2, end: 4 },
    ]);
    expect(findSearchResults('aaaaa', 'aa')).toEqual([
      { start: 0, end: 2 },
      { start: 2, end: 4 },
    ]);
  });
});

describe('calculateHighlightedChunks', () => {
  it('should pass through chunks if there are no results', () => {
    const chunks = [{ text: 'Foo', modifiers: {} }];
    const line = new AnsiLine(0, chunks);
    expect(calculateHighlightedChunks(line, 'bar')).toBe(chunks);
  });

  it('should highlight one result from plain text', () => {
    const line = new AnsiLine(0, [{ text: 'FooBarBaz', modifiers: {} }]);
    expect(calculateHighlightedChunks(line, 'foo')).toEqual([
      {
        text: 'Foo',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'BarBaz',
        modifiers: {},
      },
    ]);
    expect(calculateHighlightedChunks(line, 'bar')).toEqual([
      {
        text: 'Foo',
        modifiers: {},
      },
      {
        text: 'Bar',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'Baz',
        modifiers: {},
      },
    ]);
    expect(calculateHighlightedChunks(line, 'baz')).toEqual([
      {
        text: 'FooBar',
        modifiers: {},
      },
      {
        text: 'Baz',
        modifiers: {},
        highlight: 0,
      },
    ]);
  });

  it('should highlight multiple results from plain text', () => {
    const line = new AnsiLine(0, [
      { text: 'FooBarBazBazBarFoo', modifiers: {} },
    ]);
    expect(calculateHighlightedChunks(line, 'foo')).toEqual([
      {
        text: 'Foo',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'BarBazBazBar',
        modifiers: {},
      },
      {
        text: 'Foo',
        modifiers: {},
        highlight: 1,
      },
    ]);
    expect(calculateHighlightedChunks(line, 'bar')).toEqual([
      {
        text: 'Foo',
        modifiers: {},
      },
      {
        text: 'Bar',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'BazBaz',
        modifiers: {},
      },
      {
        text: 'Bar',
        modifiers: {},
        highlight: 1,
      },
      {
        text: 'Foo',
        modifiers: {},
      },
    ]);
    expect(calculateHighlightedChunks(line, 'baz')).toEqual([
      {
        text: 'FooBar',
        modifiers: {},
      },
      {
        text: 'Baz',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'Baz',
        modifiers: {},
        highlight: 1,
      },
      {
        text: 'BarFoo',
        modifiers: {},
      },
    ]);
  });

  it('should forward modifiers to result', () => {
    const line = new AnsiLine(0, [
      { text: 'FooBarBazBazBarFoo', modifiers: { bold: true } },
    ]);
    expect(calculateHighlightedChunks(line, 'foo')).toEqual([
      {
        text: 'Foo',
        modifiers: { bold: true },
        highlight: 0,
      },
      {
        text: 'BarBazBazBar',
        modifiers: { bold: true },
      },
      {
        text: 'Foo',
        modifiers: { bold: true },
        highlight: 1,
      },
    ]);
  });

  it('should highlight full chunks', () => {
    const line = new AnsiLine(0, [
      { text: 'Foo', modifiers: { bold: true } },
      { text: 'BarBaz', modifiers: { bold: true } },
      { text: 'BazBar', modifiers: { italic: true } },
      { text: 'Foo', modifiers: { italic: true } },
    ]);
    expect(calculateHighlightedChunks(line, 'foo')).toEqual([
      {
        text: 'Foo',
        modifiers: { bold: true },
        highlight: 0,
      },
      {
        text: 'BarBaz',
        modifiers: { bold: true },
      },
      {
        text: 'BazBar',
        modifiers: { italic: true },
      },
      {
        text: 'Foo',
        modifiers: { italic: true },
        highlight: 1,
      },
    ]);
  });

  it('should highlight partial chunks', () => {
    const line = new AnsiLine(0, [
      { text: 'Fo', modifiers: { bold: true } },
      { text: 'oFooFo', modifiers: {} },
      { text: 'oBarBaz', modifiers: { italic: true } },
      { text: 'Foo', modifiers: { foreground: 'blue' } },
      { text: 'FooFoo', modifiers: { italic: true } },
      { text: 'F', modifiers: { bold: true } },
      { text: 'o', modifiers: {} },
      { text: 'o', modifiers: { bold: true } },
    ]);
    expect(calculateHighlightedChunks(line, 'foo')).toEqual([
      {
        text: 'Fo',
        modifiers: { bold: true },
        highlight: 0,
      },
      {
        text: 'o',
        modifiers: {},
        highlight: 0,
      },
      {
        text: 'Foo',
        modifiers: {},
        highlight: 1,
      },
      {
        text: 'Fo',
        modifiers: {},
        highlight: 2,
      },
      {
        text: 'o',
        modifiers: { italic: true },
        highlight: 2,
      },
      {
        text: 'BarBaz',
        modifiers: { italic: true },
      },
      {
        text: 'Foo',
        modifiers: { foreground: 'blue' },
        highlight: 3,
      },
      {
        text: 'Foo',
        modifiers: { italic: true },
        highlight: 4,
      },
      {
        text: 'Foo',
        modifiers: { italic: true },
        highlight: 5,
      },
      {
        text: 'F',
        modifiers: { bold: true },
        highlight: 6,
      },
      {
        text: 'o',
        modifiers: {},
        highlight: 6,
      },
      {
        text: 'o',
        modifiers: { bold: true },
        highlight: 6,
      },
    ]);
  });
});
