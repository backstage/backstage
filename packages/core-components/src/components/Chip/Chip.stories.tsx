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

import { type ReactNode } from 'react';
import { Plus, AlertTriangle, Pencil } from 'lucide-react';
import { Badge, type BadgeProps } from '../ui/badge';

const icons: Record<string, ReactNode> = {
  Plus: <Plus className="h-3 w-3 mr-1" />,
  AlertTriangle: <AlertTriangle className="h-3 w-3 mr-1" />,
  Pencil: <Pencil className="h-3 w-3 mr-1" />,
  None: null,
};

const defaultArgs = {
  children: 'Label',
  variant: 'default' as const,
  icon: 'None',
};

export default {
  title: 'Data Display/Badge',
  component: Badge,
  argTypes: {
    variant: {
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ],
      control: { type: 'select' },
    },
    icon: {
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
      },
    },
  },
  tags: ['!manifest'],
};

export const Default = (args: BadgeProps & { icon?: ReactNode }) => {
  const { icon, children, ...rest } = args;
  return (
    <Badge {...rest}>
      {icon}
      {children}
    </Badge>
  );
};
Default.args = defaultArgs;

export const WithIcon = (args: BadgeProps & { icon?: ReactNode }) => {
  const { icon, children, ...rest } = args;
  return (
    <Badge {...rest}>
      {icon}
      {children}
    </Badge>
  );
};
WithIcon.args = {
  ...defaultArgs,
  icon: 'Plus',
};
