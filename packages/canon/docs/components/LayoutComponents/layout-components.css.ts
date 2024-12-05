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
  background: 'linear-gradient(180deg, #F3F3F3 0%, #FFF 100%)',
  borderRadius: '4px',
  width: '100%',
  height: '180px',
  transition: 'all 0.2s ease-in-out',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    [`${box}:hover &`]: {
      transform: 'translateY(-4px)',
    },
  },
});

export const title = style({
  fontSize: '16px',
  fontFamily: 'var(--canon-font-sans)',
  transition: 'color 0.2s ease-in-out',
  marginBottom: '0.25rem',
});

export const description = style({
  fontSize: '16px',
  fontFamily: 'var(--canon-font-sans)',
  color: '#9e9e9e',
});
