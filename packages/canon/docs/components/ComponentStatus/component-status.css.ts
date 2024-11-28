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
import { recipe } from '@vanilla-extract/recipes';

export const container = style({
  display: 'flex',
  justifyContent: 'space-between',
});

export const title = style({
  color: '#3b59ff',
  fontFamily: '"Geist", sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  textDecoration: 'none',
});

export const pill = recipe({
  base: {
    fontFamily: '"Geist", sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    color: '#000',
    borderRadius: '40px',
    padding: '0px 8px',
    height: '24px',
    fontSize: '12px',
    fontWeight: 600,
    borderStyle: 'solid',
    borderWidth: '1px',
    marginLeft: '8px',
  },
  variants: {
    status: {
      notStarted: {
        backgroundColor: '#F2F2F2',
        borderColor: '#CDCDCD',
        color: '#888888',
      },
      inProgress: {
        backgroundColor: '#FFF2B9',
        borderColor: '#FFD000',
        color: '#D79927',
      },
      alpha: {
        backgroundColor: '#D7F9D7',
        borderColor: '#4ED14A',
        color: '#3A9837',
      },
      beta: {
        backgroundColor: '#D7F9D7',
        borderColor: '#4ED14A',
        color: '#3A9837',
      },
      stable: {
        backgroundColor: '#D7F9D7',
        borderColor: '#4ED14A',
        color: '#3A9837',
      },
    },
  },
});
