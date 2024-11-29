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
import { CodeSnippet } from '@backstage/core-components';
import { useTheme } from '@material-ui/core/styles';

/** @public */
export type GrpcApiDefinitionWidgetProps = {
  definition: string;
};

/** @public */
export const GrpcApiDefinitionWidget = (
  props: GrpcApiDefinitionWidgetProps,
) => {
  const theme = useTheme();
  return (
    <CodeSnippet
      customStyle={{ backgroundColor: theme.palette.background.default }}
      text={props.definition}
      language="protobuf"
      showCopyCodeButton
    />
  );
};
