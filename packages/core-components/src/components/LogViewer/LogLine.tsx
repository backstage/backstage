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

import React from 'react';
import { AnsiChunk, AnsiLine, ChunkModifiers } from './AnsiProcessor';
import startCase from 'lodash/startCase';
import clsx from 'clsx';
import { useStyles } from './styles';

export function getModifierClasses(
  classes: ReturnType<typeof useStyles>,
  modifiers: ChunkModifiers,
) {
  const classNames = new Array<string>();
  if (modifiers.bold) {
    classNames.push(classes.modifierBold);
  }
  if (modifiers.italic) {
    classNames.push(classes.modifierItalic);
  }
  if (modifiers.underline) {
    classNames.push(classes.modifierUnderline);
  }
  if (modifiers.foreground) {
    const key = `modifierForeground${startCase(
      modifiers.foreground,
    )}` as keyof typeof classes;
    classNames.push(classes[key]);
  }
  if (modifiers.background) {
    const key = `modifierBackground${startCase(
      modifiers.background,
    )}` as keyof typeof classes;
    classNames.push(classes[key]);
  }
  return classNames.length > 0 ? classNames.join(' ') : undefined;
}

export function findSearchResults(text: string, searchText: string) {
  if (!searchText || !text.includes(searchText)) {
    return undefined;
  }
  const searchResults = new Array<{ start: number; end: number }>();
  let offset = 0;
  for (;;) {
    const start = text.indexOf(searchText, offset);
    if (start === -1) {
      break;
    }
    const end = start + searchText.length;
    searchResults.push({ start, end });
    offset = end;
  }
  return searchResults;
}

export interface HighlightAnsiChunk extends AnsiChunk {
  highlight?: boolean;
}

export function calculateHighlightedChunks(
  line: AnsiLine,
  searchText: string,
): HighlightAnsiChunk[] {
  const results = findSearchResults(line.text, searchText);
  if (!results) {
    return line.chunks;
  }

  const chunks = new Array<HighlightAnsiChunk>();

  let chunkOffset = 0;
  let nextResult = results.shift();
  for (const chunk of line.chunks) {
    const { text, modifiers } = chunk;
    if (!nextResult || chunkOffset + text.length < nextResult.start) {
      chunks.push(chunk);
      chunkOffset += text.length;
      continue;
    }

    let localOffset = 0;
    while (nextResult) {
      let localStart = nextResult.start - chunkOffset;
      if (localStart < 0) {
        localStart = 0;
      }
      const localEnd = nextResult.end - chunkOffset;
      const beforeMatch = text.slice(localOffset, localStart);
      const match = text.slice(localStart, localEnd);

      if (beforeMatch) {
        chunks.push({ text: beforeMatch, modifiers });
      }
      chunks.push({ text: match, modifiers, highlight: true });

      localOffset = localStart + match.length;

      if (match.length === searchText.length) {
        nextResult = results.shift();
      } else {
        break;
      }
    }

    if (localOffset < text.length) {
      chunks.push({ text: text.slice(localOffset), modifiers });
    }

    chunkOffset += text.length;
  }

  return chunks;
}

export interface LogLineProps {
  line: AnsiLine;
  classes: ReturnType<typeof useStyles>;
  searchText: string;
}

export function LogLine({ line, classes, searchText }: LogLineProps) {
  const chunks = calculateHighlightedChunks(line, searchText);

  const elements = chunks.map(({ text, modifiers, highlight }, index) => (
    <span
      key={index}
      className={clsx(
        getModifierClasses(classes, modifiers),
        highlight && classes.textHighlight,
      )}
    >
      {text}
    </span>
  ));

  return <>{elements}</>;
}
