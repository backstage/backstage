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

import React from 'react';
import { useTheme } from '@material-ui/core';
import 'openapi-explorer';
import { BackstageTheme } from '@backstage/theme';

export type OpenApiDefinitionProps = {
  definition: string;
};

export const OpenApiDefinition = ({ definition }: OpenApiDefinitionProps) => {
  const theme: BackstageTheme = useTheme();
  return (
    <div>
      <openapi-explorer
        primary-color={
          theme.palette.info
        } /* Buttons and background of code blocks */
        secondary-color={theme.palette.primary.main} /* 1px lines */
        bg-color={theme.palette.background.default}
        bg-header-color={theme.palette.background.paper}
        text-color={theme.palette.text.primary}
        header-color={theme.palette.text.primary}
        nav-bg-color={theme.palette.background.paper}
        nav-text-color={theme.palette.text.primary}
        nav-hover-bg-color={theme.palette.background.default}
        nav-hover-text-color={theme.palette.text.primary}
        nav-item-spacing={theme.spacing(1)}
        show-info
        allow-authentication
        allow-try
        include-nulls
        allow-search
        allow-advaned-search
        allow-server-selection
        spec-url={definition}
      />
    </div>
  );
};
