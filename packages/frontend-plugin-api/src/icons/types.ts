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

import { ComponentType, JSX } from 'react';

/**
 * IconComponent is the common icon type used throughout Backstage when
 * working with and rendering generic icons, including the app system icons.
 *
 * @remarks
 *
 * The type is based on SvgIcon from Material UI, but we do not want the plugin-api
 * package to have a dependency on Material UI, nor do we want the props to be as broad
 * as the SvgIconProps interface.
 *
 * If you have the need to forward additional props from SvgIconProps, you can
 * open an issue or submit a PR to the main Backstage repo. When doing so please
 * also describe your use-case and reasoning of the addition.
 *
 * @public
 * @deprecated Use {@link IconElement} instead, passing `<MyIcon />` rather than `MyIcon`.
 */
export type IconComponent = ComponentType<{
  fontSize?: 'medium' | 'large' | 'small' | 'inherit';
}>;

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
