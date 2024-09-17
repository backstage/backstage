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

// This script is used to pick up and set the public path of the Webpack bundle
// at runtime. The meta tag is injected by the app build, but only present in
// the `index.html.tmpl` file. The runtime value of the meta tag is populated by
// the app backend, when it templates the final `index.html` file.
//
// This is needed for additional chunks to use the correct public path, and it
// is not possible to set the `__webpack_public_path__` variable outside of the
// build itself. The Webpack output also does not read any <base> tags or
// similar, this seems to be the only way to dynamically configure the public
// path at runtime.
const el = document.querySelector('meta[name="backstage-public-path"]');
const path = el?.getAttribute('content');
if (path) {
  __webpack_public_path__ = path;
}
