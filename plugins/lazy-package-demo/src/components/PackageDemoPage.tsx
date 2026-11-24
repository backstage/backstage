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

/** A page of a plugin that is installed as a package and loaded on demand. */
export function PackageDemoPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Lazy Package Demo</h1>
      <div>This package was loaded on demand.</div>
    </div>
  );
}
