/*
 * Copyright 2023 The Backstage Authors
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
 * Loads MUI v4 styles if it is available.
 *
 * This should always be used to access MUI v4 at runtime in this
 * package, to ensure that it's not brought into the bundle unnecessarily.
 *
 * @internal
 */
export function maybeLoadMui4Styles():
  | typeof import('@material-ui/core/styles')
  | undefined {
  if (
    __webpack_modules__[
      require.resolveWeak('@material-ui/core/styles') as number
    ]
  ) {
    return __webpack_modules__[
      require.resolveWeak('@material-ui/core/styles') as number
    ] as typeof import('@material-ui/core/styles');
  }
  if (__webpack_modules__[require.resolveWeak('@material-ui/core') as number]) {
    return __webpack_modules__[
      require.resolveWeak('@material-ui/core') as number
    ] as typeof import('@material-ui/core');
  }

  return undefined;
}

/**
 * Loads the MUI v4 CssBaseline component if it is available.
 *
 * This should always be used to access MUI v4 at runtime in this
 * package, to ensure that it's not brought into the bundle unnecessarily.
 *
 * @internal
 */
export function maybeLoadMui4CssBaseline():
  | typeof import('@material-ui/core/CssBaseline')['default']
  | undefined {
  if (
    __webpack_modules__[
      require.resolveWeak('@material-ui/core/CssBaseline') as number
    ]
  ) {
    const m = __webpack_modules__[
      require.resolveWeak('@material-ui/core/CssBaseline') as number
    ] as typeof import('@material-ui/core/CssBaseline');
    return m.default;
  }
  if (__webpack_modules__[require.resolveWeak('@material-ui/core') as number]) {
    const m = __webpack_modules__[
      require.resolveWeak('@material-ui/core') as number
    ] as typeof import('@material-ui/core');
    return m.CssBaseline;
  }
  return undefined;
}
