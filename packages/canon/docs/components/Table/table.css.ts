/*
 * Copyright 2024 The Backstage Authors
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

import { style, globalStyle } from '@vanilla-extract/css';

export const wrapperStyles = style({
  border: '1px solid #e7e7e7',
  borderRadius: '4px',
  overflow: 'hidden',
});

export const tableStyles = style({
  width: '100%',
  margin: '0 !important',
  padding: '0 !important',
  borderSpacing: '0px',
  borderCollapse: 'collapse',
});

export const cellStyles = style({
  padding: '12px 16px !important',
  border: 'none !important',
  textAlign: 'left',
  backgroundColor: 'white !important',
  fontFamily: '"Geist", sans-serif',
  fontSize: '16px',
  fontWeight: 300,
});

// Apply global styles to <p> elements inside cellStyles
globalStyle(`${cellStyles} p`, {
  margin: '0',
});

export const headerRowStyles = style({
  borderBottom: '1px solid #e7e7e7',
});

export const headerCellStyles = style({
  backgroundColor: '#f5f5f5 !important',
  borderBottom: '1px solid #e7e7e7 !important',
  fontWeight: 500,
  fontSize: '14px',
});

export const rowStyles = style({
  border: 'none',
  borderBottom: '1px solid #e7e7e7',
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const chipStyles = style({
  display: 'inline-block',
  fontSize: '14px !important',
  border: '1px solid #e7e7e7',
  borderRadius: '6px',
  padding: '0px 6px',
  height: '24px',
});

export const typeStyles = style({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  gap: '8px',
});
