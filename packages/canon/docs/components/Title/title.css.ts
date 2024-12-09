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

export const titleStyles = recipe({
  base: {
    fontFamily: '"Geist", sans-serif',
    margin: '0',
    fontWeight: 500,
    border: 'none',
  },
  variants: {
    type: {
      h1: {
        fontSize: '36px',
        lineHeight: '44px',
        marginBottom: '8px',
        marginTop: '0px',
      },
      h2: {
        fontSize: '24px',
        lineHeight: '32px',
        marginBottom: '12px',
        marginTop: '52px',
      },
      h3: {
        fontSize: '20px',
        lineHeight: '28px',
        marginBottom: '12px',
        marginTop: '40px',
      },
    },
  },
});
