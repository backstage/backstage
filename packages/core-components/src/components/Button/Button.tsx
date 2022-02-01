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

import MaterialButton, {
  ButtonProps as MaterialButtonProps,
} from '@material-ui/core/Button';
import React from 'react';
import { Link, LinkProps } from '../Link';

/**
 * Properties for {@link Button}
 *
 * @public
 * @remarks
 *
 * See {@link https://v4.mui.com/api/button/#props | Material-UI Button Props} for all properties
 */
export type ButtonProps = MaterialButtonProps &
  Omit<LinkProps, 'variant' | 'color'>;

/**
 * Thin wrapper on top of material-ui's {@link https://v4.mui.com/components/buttons/ | Button} component
 *
 * @public
 * @remarks
 *
 * Makes the Button to utilise react-router
 */
declare function ButtonType(props: ButtonProps): JSX.Element;

/**
 * This wrapper is here to reset the color of the Link and make typescript happy.
 */
const LinkWrapper = React.forwardRef<any, LinkProps>((props, ref) => (
  <Link ref={ref} {...props} color="initial" />
));

/** @public */
const ActualButton = React.forwardRef<any, ButtonProps>((props, ref) => (
  <MaterialButton ref={ref} component={LinkWrapper} {...props} />
)) as { (props: ButtonProps): JSX.Element };

// TODO(Rugvip): We use this as a workaround to make the exported type be a
//               function, which makes our API reference docs much nicer.
//               The first type to be exported gets priority, but it will
//               be thrown away when compiling to JS.
// @ts-ignore
export { ButtonType as Button, ActualButton as Button };
