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
import { AnsiLine, ChunkModifiers } from './AnsiProcessor';
import startCase from 'lodash/startCase';
import clsx from 'clsx';
import { useStyles } from './useStyles';

function getModifierClasses(
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

export interface LogLineProps {
  line: AnsiLine;
  classes: ReturnType<typeof useStyles>;
  searchText: string;
}

export function LogLine({ line, classes, searchText }: LogLineProps) {
  let searchResults: Array<{ start: number; end: number }> | undefined =
    undefined;
  if (searchText && line.text.includes(searchText)) {
    searchResults = [];
    let offset = 0;
    for (;;) {
      const start = line.text.indexOf(searchText, offset);
      if (start === -1) {
        break;
      }
      const end = start + searchText.length;
      searchResults.push({ start, end });
      offset = end;
    }
  }

  const output = new Array<JSX.Element>(line.chunks.length);

  let key = 0;
  let chunkOffset = 0;
  let nextResult = searchResults?.shift();
  for (const { text, modifiers } of line.chunks) {
    if (!nextResult || chunkOffset + text.length < nextResult.start) {
      output.push(
        <span key={key++} className={getModifierClasses(classes, modifiers)}>
          {text}
        </span>,
      );
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
        output.push(
          <span key={key++} className={getModifierClasses(classes, modifiers)}>
            {beforeMatch}
          </span>,
        );
      }
      output.push(
        <span
          key={key++}
          className={clsx(
            getModifierClasses(classes, modifiers),
            classes.textHighlight,
          )}
        >
          {match}
        </span>,
      );

      localOffset = localStart + match.length;

      if (match.length === searchText.length) {
        nextResult = searchResults?.shift();
      } else {
        break;
      }
    }

    if (localOffset < text.length) {
      output.push(
        <span key={key++} className={getModifierClasses(classes, modifiers)}>
          {text.slice(localOffset)}
        </span>,
      );
    }

    chunkOffset += text.length;
  }
  return <>{output}</>;
}
