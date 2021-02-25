/*
 * Copyright 2020 Spotify AB
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
import CodeIcon from '@material-ui/icons/Code';
import GitHubIcon from '@material-ui/icons/GitHub';
import React from 'react';

export const ScmIntegrationIcon = ({ type }: { type?: string }) => {
  // TODO: In the future we might want to support more types here as a GitLab or
  // Bitbucket icons were requested here in the past, or even use the icon
  // customization feature of the app. But material UI react doesn't provide more.

  switch (type) {
    case 'github':
      return <GitHubIcon />;
    default:
      return <CodeIcon />;
  }
};
