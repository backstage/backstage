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

import { ComponentType } from 'react';

/**
 * IconComponent is the common icon type used throughout Backstage when
 * working with and rendering generic icons, including the app system icons.
 *
 * @remarks
 *
 * The type is based on SvgIcon from Material UI, but both do not what the plugin-api
 * package to have a dependency on Material UI, nor do we want the props to be as broad
 * as the SvgIconProps interface.
 *
 * If you have the need to forward additional props from SvgIconProps, you can
 * open an issue or submit a PR to the main Backstage repo. When doing so please
 * also describe your use-case and reasoning of the addition.
 *
 * @public
 */

export type IconComponent = ComponentType<
  /* Material UI v4 */
  | {
      fontSize?: 'large' | 'small' | 'default' | 'inherit';
    }
  /* Material UI v5: https://mui.com/material-ui/migration/v5-component-changes/#icon */
  | {
      fontSize?: 'medium' | 'large' | 'small' | 'inherit';
    }
>;
