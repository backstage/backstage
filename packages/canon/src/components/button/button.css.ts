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
// import { vars } from '../../theme/themes.css';

export const button = recipe({
  base: {
    all: 'unset',
    display: 'inline-flex',
    alignItems: 'center',
    userSelect: 'none',
    fontFamily: 'var(--canon-font-sans)',
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: '1.5',
    padding: 0,
    transition: 'all 150ms ease',
    cursor: 'pointer',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'var(--button-primary-background-color)',
        color: 'var(--button-primary-text-color)',
        borderRadius: 'var(--button-primary-border-radius)',
        border: `1px solid var(--button-primary-border-color)`,
        '&:hover': {
          backgroundColor: 'var(--button-primary-background-color-hover)',
          borderColor: 'var(--button-primary-border-color-hover)',
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: 'var(--button-secondary-text-color)',
        borderRadius: 'var(--button-secondary-border-radius)',
        border: `1px solid var(--button-secondary-border-color)`,
        '&:hover': {
          backgroundColor: 'var(--button-secondary-background-color-hover)',
          borderColor: 'var(--button-secondary-border-color-hover)',
        },
      },
    },
    size: {
      small: {
        paddingLeft: '16px',
        paddingRight: '16px',
        height: 'var(--button-size-small)',
      },
      medium: {
        paddingLeft: '32px',
        paddingRight: '32px',
        height: 'var(--button-size-medium)',
      },
    },
    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'not-allowed',
      },
    },
  },
});
