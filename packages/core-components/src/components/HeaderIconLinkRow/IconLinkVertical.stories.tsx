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
import React from 'react';
import { IconLinkVertical, IconLinkVerticalProps } from './IconLinkVertical';
import LinkIcon from '@material-ui/icons/Link';

export default {
  title: 'Core/IconLinkVertical',
  component: IconLinkVertical,
};

export const Primary = (args: IconLinkVerticalProps) => (
  <IconLinkVertical {...args} />
);

Primary.args = {
  color: 'primary',
  disabled: false,
  href: 'https://backstage.io',
  icon: <LinkIcon />,
  label: 'Primary Link',
  title: 'Primary Link',
};

export const PrimaryDisabled = (args: IconLinkVerticalProps) => (
  <IconLinkVertical {...args} />
);

PrimaryDisabled.args = {
  color: 'primary',
  disabled: true,
  href: 'https://backstage.io',
  icon: <LinkIcon />,
  label: 'Primary Link',
  title: 'Primary Link',
};

export const Secondary = (args: IconLinkVerticalProps) => (
  <IconLinkVertical {...args} />
);

Secondary.args = {
  color: 'secondary',
  disabled: false,
  href: 'https://backstage.io',
  icon: <LinkIcon />,
  label: 'Secondary Link',
  title: 'Secondary Link',
};

export const SecondaryDisabled = (args: IconLinkVerticalProps) => (
  <IconLinkVertical {...args} />
);

SecondaryDisabled.args = {
  color: 'secondary',
  disabled: true,
  href: 'https://backstage.io',
  icon: <LinkIcon />,
  label: 'Secondary Link',
  title: 'Secondary Link',
};
