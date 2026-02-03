/*
 * Copyright 2025 The Backstage Authors
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

// Valid spacing values that have predefined utility classes
const validSpacingValues = [
  '0.5',
  '1',
  '1.5',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
] as const;

const columnsValues = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'auto',
] as const;

export const utilityClassMap = {
  m: {
    class: 'bui-m',
    cssVar: '--m',
    values: validSpacingValues,
  },
  mb: {
    class: 'bui-mb',
    cssVar: '--mb',
    values: validSpacingValues,
  },
  ml: {
    class: 'bui-ml',
    cssVar: '--ml',
    values: validSpacingValues,
  },
  mr: {
    class: 'bui-mr',
    cssVar: '--mr',
    values: validSpacingValues,
  },
  mt: {
    class: 'bui-mt',
    cssVar: '--mt',
    values: validSpacingValues,
  },
  mx: {
    class: 'bui-mx',
    cssVar: '--mx',
    values: validSpacingValues,
  },
  my: {
    class: 'bui-my',
    cssVar: '--my',
    values: validSpacingValues,
  },
  p: {
    class: 'bui-p',
    cssVar: '--p',
    values: validSpacingValues,
  },
  pb: {
    class: 'bui-pb',
    cssVar: '--pb',
    values: validSpacingValues,
  },
  pl: {
    class: 'bui-pl',
    cssVar: '--pl',
    values: validSpacingValues,
  },
  pr: {
    class: 'bui-pr',
    cssVar: '--pr',
    values: validSpacingValues,
  },
  pt: {
    class: 'bui-pt',
    cssVar: '--pt',
    values: validSpacingValues,
  },
  px: {
    class: 'bui-px',
    cssVar: '--px',
    values: validSpacingValues,
  },
  py: {
    class: 'bui-py',
    cssVar: '--py',
    values: validSpacingValues,
  },
  width: {
    class: 'bui-w',
    cssVar: '--width',
    values: [], // Always use custom value
  },
  minWidth: {
    class: 'bui-min-w',
    cssVar: '--min-width',
    values: [], // Always use custom value
  },
  maxWidth: {
    class: 'bui-max-w',
    cssVar: '--max-width',
    values: [], // Always use custom value
  },
  height: {
    class: 'bui-h',
    cssVar: '--height',
    values: [], // Always use custom value
  },
  minHeight: {
    class: 'bui-min-h',
    cssVar: '--min-height',
    values: [], // Always use custom value
  },
  maxHeight: {
    class: 'bui-max-h',
    cssVar: '--max-height',
    values: [], // Always use custom value
  },
  gap: {
    class: 'bui-gap',
    cssVar: '--gap',
    values: validSpacingValues,
  },
  position: {
    class: 'bui-position',
    values: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
  },
  display: {
    class: 'bui-display',
    values: ['none', 'flex', 'block', 'inline'],
  },
  align: {
    class: 'bui-align',
    values: ['start', 'center', 'end', 'baseline', 'stretch'],
  },
  justify: {
    class: 'bui-jc',
    values: ['start', 'center', 'end', 'between'],
  },
  direction: {
    class: 'bui-fd',
    values: ['row', 'column', 'row-reverse', 'column-reverse'],
  },
  columns: {
    class: 'bui-columns',
    values: columnsValues,
  },
  colSpan: {
    class: 'bui-col-span',
    values: columnsValues,
  },
  colEnd: {
    class: 'bui-col-end',
    values: columnsValues,
  },
  colStart: {
    class: 'bui-col-start',
    values: columnsValues,
  },
  rowSpan: {
    class: 'bui-row-span',
    values: columnsValues,
  },
} as const satisfies Record<
  string,
  { class: string; cssVar?: string; values: readonly (string | number)[] }
>;
