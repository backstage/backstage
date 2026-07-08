/*
 * Copyright 2020 The Backstage Authors
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

import { JSX } from 'react';

/**
 * The type used for icon elements throughout Backstage.
 *
 * @remarks
 *
 * Icon elements should behave like rendering a plain icon directly, for example
 * from `@remixicon/react`, and are expected to be sized by the surrounding UI.
 * Icons should be exactly 24x24 pixels in size by default.
 *
 * Using icons from `@remixicon/react` is preferred. Using icons from
 * `@material-ui/icons` or `AppIcon` and its variants from
 * `@backstage/core-components` is supported while migrating, but deprecated.
 * When using those icons, you must set `fontSize="inherit"` on the element.
 *
 * @public
 */
export type IconElement = JSX.Element | null;
