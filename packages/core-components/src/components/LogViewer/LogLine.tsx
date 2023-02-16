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

import React, { useMemo } from 'react';
import Typography from '@material-ui/core/Typography';
import { AnsiChunk, AnsiLine, ChunkModifiers } from './AnsiProcessor';
import startCase from 'lodash/startCase';
import classnames from 'classnames';
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
  highlight?: number;
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

  let lineOffset = 0;
  let resultIndex = 0;
  let result = results[resultIndex];
  for (const chunk of line.chunks) {
    const { text, modifiers } = chunk;
    if (!result || lineOffset + text.length < result.start) {
      chunks.push(chunk);
      lineOffset += text.length;
      continue;
    }

    let localOffset = 0;
    while (result) {
      const localStart = Math.max(result.start - lineOffset, 0);
      if (localStart > text.length) {
        break; // The next result is not in this chunk
      }

      const localEnd = Math.min(result.end - lineOffset, text.length);

      const hasTextBeforeResult = localStart > localOffset;
      if (hasTextBeforeResult) {
        chunks.push({ text: text.slice(localOffset, localStart), modifiers });
      }
      const hasResultText = localEnd > localStart;
      if (hasResultText) {
        chunks.push({
          modifiers,
          highlight: resultIndex,
          text: text.slice(localStart, localEnd),
        });
      }

      localOffset = localEnd;

      const foundCompleteResult = result.end - lineOffset === localEnd;
      if (foundCompleteResult) {
        resultIndex += 1;
        result = results[resultIndex];
      } else {
        break; // The rest of the result is in the following chunks
      }
    }

    const hasTextAfterResult = localOffset < text.length;
    if (hasTextAfterResult) {
      chunks.push({ text: text.slice(localOffset), modifiers });
    }

    lineOffset += text.length;
  }

  return chunks;
}

export interface LogLineProps {
  line: AnsiLine;
  classes: ReturnType<typeof useStyles>;
  searchText: string;
  highlightResultIndex?: number;
}

export function LogLine({
  line,
  classes,
  searchText,
  highlightResultIndex,
}: LogLineProps) {
  const chunks = useMemo(
    () => calculateHighlightedChunks(line, searchText),
    [line, searchText],
  );

  const elements = useMemo(
    () =>
      chunks.map(({ text, modifiers, highlight }, index) => (
        <Typography
          component="span"
          key={index}
          className={classnames(
            getModifierClasses(classes, modifiers),
            highlight !== undefined &&
              (highlight === highlightResultIndex
                ? classes.textSelectedHighlight
                : classes.textHighlight),
          )}
        >
          {text}
        </Typography>
      )),
    [chunks, highlightResultIndex, classes],
  );

  return <>{elements}</>;
}
