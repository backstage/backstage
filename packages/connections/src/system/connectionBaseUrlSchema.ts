/*
 * Copyright 2026 The Backstage Authors
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
import { z } from 'zod/v4';

/**
 * An HTTP(S) base root with a trailing slash for resolving relative paths.
 * Keeps the configured spelling, including percent-encoded path content.
 * Connection types must add any provider-specific protocol or host restrictions.
 */
export const connectionBaseUrlSchema = z
  .string()
  .refine(
    value => !/[\\\s?#]/.test(value),
    'Base URLs must not contain backslashes, whitespace, queries or fragments',
  )
  .refine(
    value => Array.from(value).every(char => char.charCodeAt(0) >= 0x20),
    'Base URLs must not contain control characters',
  )
  .refine(value => {
    const separator = value.indexOf('://');
    if (separator === -1) {
      return false;
    }
    const authority = value.slice(separator + 3).split('/')[0];
    return authority.length > 0 && !authority.includes('@');
  }, 'Base URLs must have an explicit host without credentials')
  .check(z.url({ protocol: /^https?$/ }))
  .transform(value => (value.endsWith('/') ? value : `${value}/`));
