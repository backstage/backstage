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

export const HEADER_SIZE = 40;

/** @public Class keys for overriding LogViewer styles */
export type LogViewerClassKey =
  | 'root'
  | 'header'
  | 'log'
  | 'line'
  | 'lineSelected'
  | 'lineCopyButton'
  | 'lineNumber'
  | 'textHighlight'
  | 'textSelectedHighlight'
  | 'modifierBold'
  | 'modifierItalic'
  | 'modifierUnderline'
  | 'modifierForegroundBlack'
  | 'modifierForegroundRed'
  | 'modifierForegroundGreen'
  | 'modifierForegroundYellow'
  | 'modifierForegroundBlue'
  | 'modifierForegroundMagenta'
  | 'modifierForegroundCyan'
  | 'modifierForegroundWhite'
  | 'modifierForegroundGrey'
  | 'modifierBackgroundBlack'
  | 'modifierBackgroundRed'
  | 'modifierBackgroundGreen'
  | 'modifierBackgroundYellow'
  | 'modifierBackgroundBlue'
  | 'modifierBackgroundMagenta'
  | 'modifierBackgroundCyan'
  | 'modifierBackgroundWhite'
  | 'modifierBackgroundGrey';

/**
 * TypeScript type representing the full map of LogViewer CSS class strings.
 * Includes all LogViewerClassKey members plus the `textWrap` utility class.
 * Replaces the previous `ReturnType<typeof useStyles>` pattern.
 * @public
 */
export type LogViewerClasses = Record<LogViewerClassKey | 'textWrap', string>;

/**
 * Static Tailwind CSS class map for the LogViewer component.
 *
 * Replaces the MUI `makeStyles` hook (`useStyles`) with a zero-runtime object
 * of Tailwind utility class strings. Theme-dependent values resolve through
 * CSS custom properties (e.g., `bg-card` → `var(--card)`), while ANSI color
 * modifiers map directly to Tailwind's color palette classes.
 *
 * @remarks
 * Property keys are identical to the previous `useStyles` output to maintain
 * full backward compatibility with `LogLine.tsx`'s `getModifierClasses` function.
 */
export const logViewerStyles: LogViewerClasses = {
  /* Layout — root container background */
  root: 'bg-card',

  /* Header bar — fixed height matching HEADER_SIZE, right-aligned controls */
  header: 'h-[40px] flex items-center justify-end',

  /* Log content — monospace font, 12px / 20px line-height */
  log: 'font-mono text-xs leading-5',

  /* Individual log line — pre-formatted, flex row, hover highlight */
  line: 'relative whitespace-pre flex items-start hover:bg-accent',

  /* Selected log line — persistent selection highlight, overrides hover */
  lineSelected: 'bg-accent hover:bg-accent',

  /* Copy button overlay — absolutely positioned, no vertical padding */
  lineCopyButton: 'absolute pt-0 pb-0 hover:text-primary',

  /* Line number gutter — fixed width, right-aligned, decorative border */
  lineNumber:
    'inline-block text-end w-[60px] pr-2 mr-2 cursor-pointer shrink-0 text-blue-400 border-r border-blue-700',

  /* Search result highlight — translucent info color background */
  textHighlight: 'bg-blue-500/15',

  /* Active/selected search result highlight — stronger opacity */
  textSelectedHighlight: 'bg-blue-500/40',

  /* ANSI text style modifiers */
  modifierBold: 'font-bold',
  modifierItalic: 'italic',
  modifierUnderline: 'underline',

  /* ANSI foreground (text) color modifiers */
  modifierForegroundBlack: 'text-black dark:text-black',
  modifierForegroundRed: 'text-red-500',
  modifierForegroundGreen: 'text-green-500',
  modifierForegroundYellow: 'text-yellow-500',
  modifierForegroundBlue: 'text-blue-500',
  modifierForegroundMagenta: 'text-purple-500',
  modifierForegroundCyan: 'text-cyan-500',
  modifierForegroundWhite: 'text-white',
  modifierForegroundGrey: 'text-gray-500',

  /* ANSI background color modifiers */
  modifierBackgroundBlack: 'bg-black',
  modifierBackgroundRed: 'bg-red-500',
  modifierBackgroundGreen: 'bg-green-500',
  modifierBackgroundYellow: 'bg-yellow-500',
  modifierBackgroundBlue: 'bg-blue-500',
  modifierBackgroundMagenta: 'bg-purple-500',
  modifierBackgroundCyan: 'bg-cyan-500',
  modifierBackgroundWhite: 'bg-white',
  modifierBackgroundGrey: 'bg-gray-500',

  /* Text wrapping — enables pre-wrap with forced word-break */
  textWrap: 'whitespace-pre-wrap break-all',
};
