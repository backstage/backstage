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

import { useTheme } from '@material-ui/core';
import { JsonSchemaViewer } from '@stoplight/json-schema-viewer';
import { injectStyles, useThemeStore } from '@stoplight/mosaic';
import React, { useMemo } from 'react';
import { useEffectOnce } from 'react-use';

injectStyles();

type Props = {
  definition: any;
};

export const JsonSchemaDefinitionWidget = ({ definition }: Props) => {
  const schema = useMemo(() => JSON.parse(definition), [definition]);
  const theme = useTheme();
  const themeStore = useThemeStore();

  useEffectOnce(() => {
    themeStore.setColor('background', theme.palette.background.paper);
    themeStore.setColor('text', theme.palette.text.primary);
    themeStore.setColor('primary', theme.palette.primary.main);
    themeStore.setColor('success', theme.palette.success.main);
    themeStore.setColor('warning', theme.palette.warning.main);
    themeStore.setColor('danger', theme.palette.error.main);
    themeStore.setMode(theme.palette.type);
  });
  return (
    <JsonSchemaViewer
      schema={schema}
      emptyText="No schema defined"
      defaultExpandedDepth={5}
    />
  );
};
