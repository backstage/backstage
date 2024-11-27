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

import { recipe } from '@vanilla-extract/recipes';
import { globalStyle, style } from '@vanilla-extract/css';

export const bannerStyles = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    fontFamily: '"Geist", sans-serif',
    fontSize: '16px',
    lineHeight: '28px',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '16px',
    border: '1px solid #e0e0e0',
  },
  variants: {
    variant: {
      info: {
        backgroundColor: '#F2F2F2',
        borderColor: '#CDCDCD',
        color: '#888888',
      },
      warning: {
        backgroundColor: '#FFF2B9',
        borderColor: '#FFD000',
        color: '#D79927',
      },
    },
  },
});

globalStyle(`${bannerStyles.classNames.base} p`, {
  margin: '0',
});

export const bannerIconStyles = style({
  width: '32px',
  height: '32px',
  backgroundColor: 'rgba(215, 153, 39, 0.2)',
  borderRadius: '6px',
  marginRight: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
