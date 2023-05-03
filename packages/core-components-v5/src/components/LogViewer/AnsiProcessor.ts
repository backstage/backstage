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

import ansiRegexMaker from 'ansi-regex';

const ansiRegex = ansiRegexMaker();
const newlineRegex = /\n\r?/g;

// A mapping of how each escape code changes the modifiers
const codeModifiers = Object.fromEntries(
  Object.entries({
    1: m => ({ ...m, bold: true }),
    3: m => ({ ...m, italic: true }),
    4: m => ({ ...m, underline: true }),
    22: ({ bold: _, ...m }) => m,
    23: ({ italic: _, ...m }) => m,
    24: ({ underline: _, ...m }) => m,
    30: m => ({ ...m, foreground: 'black' }),
    31: m => ({ ...m, foreground: 'red' }),
    32: m => ({ ...m, foreground: 'green' }),
    33: m => ({ ...m, foreground: 'yellow' }),
    34: m => ({ ...m, foreground: 'blue' }),
    35: m => ({ ...m, foreground: 'magenta' }),
    36: m => ({ ...m, foreground: 'cyan' }),
    37: m => ({ ...m, foreground: 'white' }),
    39: ({ foreground: _, ...m }) => m,
    90: m => ({ ...m, foreground: 'grey' }),
    40: m => ({ ...m, background: 'black' }),
    41: m => ({ ...m, background: 'red' }),
    42: m => ({ ...m, background: 'green' }),
    43: m => ({ ...m, background: 'yellow' }),
    44: m => ({ ...m, background: 'blue' }),
    45: m => ({ ...m, background: 'magenta' }),
    46: m => ({ ...m, background: 'cyan' }),
    47: m => ({ ...m, background: 'white' }),
    49: ({ background: _, ...m }) => m,
  } as Record<string, (m: ChunkModifiers) => ChunkModifiers>).map(
    ([code, modifier]) => [`\x1b[${code}m`, modifier],
  ),
);

export type AnsiColor =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'grey';

export interface ChunkModifiers {
  foreground?: AnsiColor;
  background?: AnsiColor;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface AnsiChunk {
  text: string;
  modifiers: ChunkModifiers;
}

export class AnsiLine {
  text: string;

  constructor(
    readonly lineNumber: number = 1,
    readonly chunks: AnsiChunk[] = [],
  ) {
    this.text = chunks
      .map(c => c.text)
      .join('')
      .toLocaleLowerCase('en-US');
  }

  lastChunk(): AnsiChunk | undefined {
    return this.chunks[this.chunks.length - 1];
  }

  replaceLastChunk(newChunks?: AnsiChunk[]) {
    if (newChunks) {
      this.chunks.splice(this.chunks.length - 1, 1, ...newChunks);
      this.text = this.chunks
        .map(c => c.text)
        .join('')
        .toLocaleLowerCase('en-US');
    }
  }
}

export class AnsiProcessor {
  private text: string = '';
  private lines: AnsiLine[] = [];

  /**
   * Processes a chunk of text while keeping internal state that optimizes
   * subsequent processing that appends to the text.
   */
  process(text: string): AnsiLine[] {
    if (this.text === text) {
      return this.lines;
    }

    if (text.startsWith(this.text)) {
      const lastLineIndex = this.lines.length > 0 ? this.lines.length - 1 : 0;
      const lastLine = this.lines[lastLineIndex] ?? new AnsiLine();
      const lastChunk = lastLine.lastChunk();

      const newLines = this.processLines(
        (lastChunk?.text ?? '') + text.slice(this.text.length),
        lastChunk?.modifiers,
        lastLine?.lineNumber,
      );
      lastLine.replaceLastChunk(newLines[0]?.chunks);

      this.lines[lastLineIndex] = lastLine;
      this.lines.push(...newLines.slice(1));
    } else {
      this.lines = this.processLines(text);
    }
    this.text = text;

    return this.lines;
  }

  // Split a chunk of text up into lines and process each line individually
  private processLines = (
    text: string,
    modifiers: ChunkModifiers = {},
    startingLineNumber: number = 1,
  ): AnsiLine[] => {
    const lines: AnsiLine[] = [];

    let currentModifiers = modifiers;
    let currentLineNumber = startingLineNumber;

    let prevIndex = 0;
    newlineRegex.lastIndex = 0;
    for (;;) {
      const match = newlineRegex.exec(text);
      if (!match) {
        const chunks = this.processText(
          text.slice(prevIndex),
          currentModifiers,
        );
        lines.push(new AnsiLine(currentLineNumber, chunks));
        return lines;
      }

      const line = text.slice(prevIndex, match.index);
      prevIndex = match.index + match[0].length;

      const chunks = this.processText(line, currentModifiers);
      lines.push(new AnsiLine(currentLineNumber, chunks));

      // Modifiers that are active in the last chunk are carried over to the next line
      currentModifiers =
        chunks[chunks.length - 1].modifiers ?? currentModifiers;
      currentLineNumber += 1;
    }
  };

  // Processing of a one individual text chunk
  private processText = (
    fullText: string,
    modifiers: ChunkModifiers,
  ): AnsiChunk[] => {
    const chunks: AnsiChunk[] = [];

    let currentModifiers = modifiers;

    let prevIndex = 0;
    ansiRegex.lastIndex = 0;
    for (;;) {
      const match = ansiRegex.exec(fullText);
      if (!match) {
        chunks.push({
          text: fullText.slice(prevIndex),
          modifiers: currentModifiers,
        });
        return chunks;
      }

      const text = fullText.slice(prevIndex, match.index);
      chunks.push({ text, modifiers: currentModifiers });

      // For every escape code that we encounter we keep track of where the
      // next chunk of text starts, and what modifiers it has
      prevIndex = match.index + match[0].length;
      currentModifiers = this.processCode(match[0], currentModifiers);
    }
  };

  private processCode = (
    code: string,
    modifiers: ChunkModifiers,
  ): ChunkModifiers => {
    return codeModifiers[code]?.(modifiers) ?? modifiers;
  };
}
