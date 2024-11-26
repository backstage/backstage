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

import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '1rem',
  flexWrap: 'wrap',
});

export const box = style({
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(33.33% - 0.67rem)',
  marginBottom: '1rem',
  alignItems: 'flex-start',
});

export const content = style({
  flex: 'none',
  background: '#f2f2f2',
  borderRadius: '4px',
  width: '100%',
  height: '180px',
  border: '1px solid #e0e0e0',
  transition: 'border-color 0.2s ease-in-out',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    [`${box}:hover &`]: {
      borderColor: '#1f47ff',
    },
  },
});

export const title = style({
  fontSize: '16px',
  fontFamily: 'var(--canon-font-sans)',
  transition: 'color 0.2s ease-in-out',
  marginBottom: '0.25rem',
  selectors: {
    [`${box}:hover &`]: {
      color: '#1f47ff',
    },
  },
});

export const description = style({
  fontSize: '16px',
  fontFamily: 'var(--canon-font-sans)',
  color: '#9e9e9e',
});

export const whiteBox = style({
  background: '#fff',
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
});

export const whiteBoxStack = style([
  whiteBox,
  {
    width: '40%',
    height: '28px',
  },
]);

export const whiteBoxColumns = style([
  whiteBox,
  {
    width: '30%',
    height: '32px',
  },
]);

export const whiteBoxInline = style([
  whiteBox,
  {
    width: '32px',
    height: '32px',
  },
]);

export const whiteBoxTiles = style([
  whiteBox,
  {
    width: '100%',
    height: '32px',
  },
]);

export const stack = style({
  display: 'flex',
  flexDirection: 'column',
});

export const columns = style({
  display: 'flex',
  flexDirection: 'row',
});

export const inline = style({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '0.5rem',
  paddingLeft: '1rem',
});

export const tiles = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '0.5rem',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  width: '100%',
});

export const verticalDivider = style({
  display: 'flex',
  flexShrink: 0,
  flexDirection: 'column',
  position: 'relative',
  height: '20px',
  width: '2px',
  backgroundColor: '#1f47ff',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-9px',
      width: '20px',
      height: '2px',
      backgroundColor: '#1f47ff',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '-9px',
      width: '20px',
      height: '2px',
      backgroundColor: '#1f47ff',
    },
  },
});

export const horizontalDivider = style({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  height: '2px',
  width: '20px',
  backgroundColor: '#1f47ff',
  selectors: {
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '-9px',
      width: '2px',
      height: '20px',
      backgroundColor: '#1f47ff',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      right: 0,
      top: '-9px',
      width: '2px',
      height: '20px',
      backgroundColor: '#1f47ff',
    },
  },
});
