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

import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useEffect, useState } from 'react';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { AnsiLine } from './AnsiProcessor';

type Selection = {
  start: number;
  end: number;
};

export function useLogViewerSelection(lines: AnsiLine[]) {
  const errorApi = useApi(errorApiRef);
  const [selections, setSelections] = useState<Selection[]>([]);

  const [{ error }, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  const findClosestSelection = (
    allSelections: Selection[],
    line: number,
  ): Selection | undefined => {
    if (selections.length === 0) {
      return undefined;
    }
    let minDistance = Number.MAX_SAFE_INTEGER;
    let closestSelection: Selection | undefined = undefined;

    allSelections.forEach(s => {
      const distance = Math.min(
        Math.abs(s.start - line),
        Math.abs(s.end - line),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestSelection = s;
      }
    });

    return closestSelection;
  };

  const mergeNeighbouringSelections = (
    allSelections: Selection[],
    line: number,
  ): Selection[] => {
    // Merge selections if they're next to each other
    const neighboringSelections = allSelections.filter(
      s => s.start - 1 === line || s.end + 1 === line,
    );
    if (neighboringSelections.length === 0) {
      return allSelections;
    }
    const newSelection = {
      start: Math.min(line, ...neighboringSelections.map(s => s.start)),
      end: Math.max(line, ...neighboringSelections.map(s => s.end)),
    };

    return [
      ...allSelections.filter(
        s =>
          !neighboringSelections.includes(s) &&
          !(s.start === line && s.end === line),
      ),
      newSelection,
    ];
  };

  return {
    shouldShowCopyButton(line: number) {
      // show copy button at the beginning of each selection
      return selections.some(s => s.start === line);
    },
    isSelected(line: number) {
      if (!selections) {
        return false;
      }
      // check if line is in any selection range
      return selections.some(
        s => s.start <= line && (s.end ?? s.start) >= line,
      );
    },
    setSelection(line: number, addRange: boolean, addNewSelection: boolean) {
      setSelections(currentSelections => {
        const clickedSelection = currentSelections.find(
          s => s.start <= line && s.end >= line,
        );
        const otherSelections = currentSelections.filter(
          s => s !== clickedSelection,
        );

        if (!addRange && !addNewSelection) {
          // Normal click -> select only this line if nothing or multiple lines are selected
          if (
            !clickedSelection ||
            clickedSelection.start !== clickedSelection.end
          ) {
            return [{ start: line, end: line }];
          }
          // Clear selection if single line is selected
          return [];
        }

        if (addRange) {
          // Shift+click -> extend/reduce selection
          if (currentSelections.length === 0) {
            // No existing selection -> create new selection
            return [{ start: line, end: line }];
          }

          if (clickedSelection) {
            // Clicked inside an existing selection -> reduce selection
            if (clickedSelection.start === clickedSelection.end) {
              // Single line selection -> remove it
              return otherSelections;
            }
            // Reduce selection
            return [
              ...otherSelections,
              { start: clickedSelection.start, end: line },
            ];
          }

          // Extend the closest selection to the new line
          const closestSelection = findClosestSelection(
            currentSelections,
            line,
          );
          if (!closestSelection) {
            // Can't actually happen
            return currentSelections;
          }
          if (closestSelection.start < line) {
            // Add lines before the selection
            return mergeNeighbouringSelections(
              [
                ...otherSelections.filter(s => s !== closestSelection),
                { start: closestSelection.start, end: line },
              ],
              line,
            );
          }
          // Add lines after the selection
          return mergeNeighbouringSelections(
            [
              ...otherSelections.filter(s => s !== closestSelection),
              { start: line, end: closestSelection!.end },
            ],
            line,
          );
        }

        if (addNewSelection) {
          // Ctrl/Cmd+click -> add new selection
          if (!clickedSelection) {
            // Just add new selection
            return mergeNeighbouringSelections(
              [...currentSelections, { start: line, end: line }],
              line,
            );
          }
          if (clickedSelection.start === clickedSelection.end) {
            // Single line selection -> remove it
            return otherSelections;
          }
          // Multi line selection -> split it
          return [
            ...otherSelections,
            ...(clickedSelection.start < line
              ? [{ start: clickedSelection.start, end: line - 1 }]
              : []),
            ...(clickedSelection.end > line
              ? [{ start: line + 1, end: clickedSelection.end }]
              : []),
          ];
        }

        return [];
      });
    },
    copySelection(line: number) {
      const selection = selections.find(s => s.start === line);
      if (!selection) {
        return;
      }
      const copyText = lines
        .slice(selection.start - 1, selection.end)
        .map(l => l.chunks.map(c => c.text).join(''))
        .join('\n');
      copyToClipboard(copyText);
    },
    getHash() {
      if (selections.length === 0) {
        return '';
      }
      const parts = selections.map(s => {
        if (s.start === s.end) {
          return `${s.start}`;
        }
        return `${s.start}-${s.end}`;
      });
      return `#lines-${parts.join(',')}`;
    },
    selectAll(hash: string) {
      const match = hash.match(/#lines-([\d,-]+)/);
      const s: Selection[] = [];
      if (match) {
        const ranges = match[1].split(',');
        ranges.forEach(r => {
          const [start, end] = r.split('-').map(Number);
          s.push({ start, end: end ?? start });
        });
      }
      setSelections(s);
    },
  };
}
