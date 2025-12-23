/*
 * Copyright 2021 The Backstage Authors
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
import SvgIcon from '@material-ui/core/SvgIcon';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon/SvgIcon';
import { IconComponent } from '@backstage/core-plugin-api';

export function EntityIcon({
  icon,
  width,
  height,
  ...props
}: {
  icon: IconComponent | undefined;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const Icon = (icon as OverridableComponent<SvgIconTypeMap>) ?? SvgIcon;
  return (
    <Icon
      style={{ width, height, fontSize: height }}
      width={width}
      height={height}
      {...props}
    />
  );
}
