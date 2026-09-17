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

import { RuleTester } from 'eslint';
import rule from '../rules/no-deprecated-bui-tokens';

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
});

ruleTester.run('no-deprecated-bui-tokens', rule, {
  valid: [
    // Non-deprecated tokens — should not warn
    { code: `const s = 'var(--bui-fg-primary)'` },
    { code: `const s = 'var(--bui-fg-secondary)'` },
    { code: `const s = 'var(--bui-fg-disabled)'` },
    { code: `const s = 'var(--bui-fg-warning)'` },
    { code: `const s = 'var(--bui-fg-positive)'` },
    { code: `const s = 'var(--bui-fg-negative)'` },
    { code: `const s = 'var(--bui-fg-announcement)'` },
    { code: `const s = 'var(--bui-border-1)'` },
    { code: `const s = 'var(--bui-border-2)'` },
    { code: `const s = 'var(--bui-accent-bg)'` },
    { code: `const s = 'var(--bui-accent-bg-hover)'` },
    { code: `const s = 'var(--bui-accent-bg-disabled)'` },
    { code: `const s = 'var(--bui-accent-fg)'` },
    { code: `const s = 'var(--bui-accent-fg-disabled)'` },
    { code: `const s = 'var(--bui-negative-bg)'` },
    { code: `const s = 'var(--bui-positive-bg)'` },
    { code: `const s = 'var(--bui-warning-bg)'` },
    { code: `const s = 'var(--bui-announcement-bg)'` },
    { code: `const s = 'var(--bui-gray-1)'` },
    { code: `const s = 'var(--bui-bg-app)'` },
    { code: `const s = 'var(--bui-bg-neutral-1)'` },
    { code: `const s = 'var(--bui-bg-neutral-2)'` },
    { code: `const s = 'var(--bui-bg-neutral-3)'` },
    { code: `const s = 'var(--bui-bg-neutral-4)'` },
    // Unrelated strings — should not warn
    { code: `const s = 'some-other-string'` },
    { code: `const n = 42` },
  ],

  invalid: [
    // Plain string literals
    {
      code: `const s = 'var(--bui-bg-solid)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-bg-solid' } }],
    },
    {
      code: `const s = 'var(--bui-bg-solid-hover)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-bg-solid-hover' } },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-solid-pressed)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-bg-solid-pressed' } },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-solid-disabled)'`,
      errors: [
        {
          messageId: 'deprecated',
          data: { token: '--bui-bg-solid-disabled' },
        },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-neutral-2-hover)'`,
      errors: [
        {
          messageId: 'deprecated',
          data: { token: '--bui-bg-neutral-2-hover' },
        },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-neutral-3-pressed)'`,
      errors: [
        {
          messageId: 'deprecated',
          data: { token: '--bui-bg-neutral-3-pressed' },
        },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-neutral-4-disabled)'`,
      errors: [
        {
          messageId: 'deprecated',
          data: { token: '--bui-bg-neutral-4-disabled' },
        },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-danger)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-bg-danger' } }],
    },
    {
      code: `const s = 'var(--bui-bg-warning)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-bg-warning' } },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-success)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-bg-success' } },
      ],
    },
    {
      code: `const s = 'var(--bui-bg-info)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-bg-info' } }],
    },
    {
      code: `const s = 'var(--bui-fg-solid)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-fg-solid' } }],
    },
    {
      code: `const s = 'var(--bui-fg-solid-disabled)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-solid-disabled' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-danger-on-bg)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-danger-on-bg' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-warning-on-bg)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-warning-on-bg' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-success-on-bg)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-success-on-bg' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-info-on-bg)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-info-on-bg' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-danger)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-fg-danger' } }],
    },
    {
      code: `const s = 'var(--bui-fg-success)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-success' } },
      ],
    },
    {
      code: `const s = 'var(--bui-fg-info)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-fg-info' } }],
    },
    {
      code: `const s = 'var(--bui-border-info)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-border-info' } },
      ],
    },
    {
      code: `const s = 'var(--bui-border-danger)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-border-danger' } },
      ],
    },
    {
      code: `const s = 'var(--bui-border-warning)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-border-warning' } },
      ],
    },
    {
      code: `const s = 'var(--bui-border-success)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-border-success' } },
      ],
    },
    {
      code: `const s = 'var(--bui-shadow)'`,
      errors: [{ messageId: 'deprecated', data: { token: '--bui-shadow' } }],
    },

    // Template literals
    {
      code: 'const s = `var(--bui-bg-solid)`',
      errors: [{ messageId: 'deprecated', data: { token: '--bui-bg-solid' } }],
    },
    {
      code: 'const s = `var(--bui-fg-danger)`',
      errors: [{ messageId: 'deprecated', data: { token: '--bui-fg-danger' } }],
    },
    {
      code: 'const s = `border: 1px solid var(--bui-border-danger)`',
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-border-danger' } },
      ],
    },

    // Multiple deprecated tokens in one string — one error per token
    {
      code: `const s = 'background: var(--bui-bg-solid); color: var(--bui-fg-solid)'`,
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-bg-solid' } },
        { messageId: 'deprecated', data: { token: '--bui-fg-solid' } },
      ],
    },

    // Inline style usage patterns (JSX)
    {
      code: `const el = <div style={{ background: 'var(--bui-bg-danger)' }} />`,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: { jsx: true },
      },
      errors: [{ messageId: 'deprecated', data: { token: '--bui-bg-danger' } }],
    },
    {
      code: `const el = <div style={{ color: 'var(--bui-fg-success)' }} />`,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: { jsx: true },
      },
      errors: [
        { messageId: 'deprecated', data: { token: '--bui-fg-success' } },
      ],
    },
  ],
});
