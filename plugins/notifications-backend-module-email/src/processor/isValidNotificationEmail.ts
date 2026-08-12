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

import { z } from 'zod';

/**
 * Returns true if the address is a single well-formed email suitable for
 * notification delivery. Uses Zod's default email check (not RFC 5322),
 * which rejects quoted local-parts and multi-address strings.
 */
export function isValidNotificationEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}
