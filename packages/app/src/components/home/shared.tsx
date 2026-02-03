/*
 * Copyright 2025 The Backstage Authors
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

import { TemplateBackstageLogoIcon } from '@backstage/plugin-home';
import { makeStyles } from '@material-ui/core/styles';

export const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

export const tools = [
  {
    url: 'https://backstage.io/docs',
    label: 'Docs',
    icon: <TemplateBackstageLogoIcon />,
  },
  {
    url: 'https://github.com/backstage/backstage',
    label: 'GitHub',
    icon: <TemplateBackstageLogoIcon />,
  },
  {
    url: 'https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md',
    label: 'Contributing',
    icon: <TemplateBackstageLogoIcon />,
  },
  {
    url: 'https://backstage.io/plugins',
    label: 'Plugins Directory',
    icon: <TemplateBackstageLogoIcon />,
  },
  {
    url: 'https://github.com/backstage/backstage/issues/new/choose',
    label: 'Submit New Issue',
    icon: <TemplateBackstageLogoIcon />,
  },
];
