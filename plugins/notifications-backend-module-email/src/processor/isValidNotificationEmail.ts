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

/**
 * Returns true if the address is a single unquoted local@domain suitable for
 * notification delivery. Rejects whitespace, quotes, commas, semicolons,
 * colons, angle brackets, and multiple @ characters so address-list,
 * display-name, and RFC group forms cannot be treated as one recipient by
 * nodemailer.
 */
export function isValidNotificationEmail(email: string): boolean {
  if (email.length === 0 || email !== email.trim()) {
    return false;
  }
  if (/[\s"',;<>:]/.test(email)) {
    return false;
  }
  const at = email.indexOf('@');
  return at > 0 && at === email.lastIndexOf('@') && at < email.length - 1;
}
