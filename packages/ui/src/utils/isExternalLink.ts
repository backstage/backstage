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

/**
 * Determines if a link is external.
 * @param href - The href of the link.
 * @returns True if the link is external, false otherwise.
 * @internal
 */
export function isExternalLink(href?: string): boolean {
  if (!href) return false;

  // Check if it's an absolute URL with protocol
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return true;
  }

  // Check if it's a protocol-relative URL
  if (href.startsWith('//')) {
    return true;
  }

  // Check if it's a mailto: or tel: link
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return true;
  }

  return false;
}
