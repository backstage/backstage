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
  .regex(
    // Require an explicit authority, without URL parser repairs, credentials,
    // controls, query or fragment delimiters (even when their values are empty).
    // eslint-disable-next-line no-control-regex
    /^[hH][tT][tT][pP][sS]?:\/\/[^/?#@\\\s\x00-\x1f]+(?:\/[^?#\\\s\x00-\x1f]*)?$(?![\s\S])/,
    'Expected an HTTP(S) base URL without credentials, query or fragment',
  )
  .check(z.url())
  .transform(value => (value.endsWith('/') ? value : `${value}/`));
