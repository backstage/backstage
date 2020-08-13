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

import React, { FC } from 'react';
import { AsyncApiDefinitionWidget } from '../AsyncApiDefinitionWidget/AsyncApiDefinitionWidget';
import { OpenApiDefinitionWidget } from '../OpenApiDefinitionWidget/OpenApiDefinitionWidget';
import { PlainApiDefinitionWidget } from '../PlainApiDefinitionWidget/PlainApiDefinitionWidget';

export const ApiDefinitionWidget: FC<{
  type: string;
  definition: string;
}> = ({ type, definition }) => {
  switch (type) {
    case 'openapi':
      return <OpenApiDefinitionWidget definition={definition} />;

    case 'asyncapi':
      return <AsyncApiDefinitionWidget definition={definition} />;

    default:
      return <PlainApiDefinitionWidget definition={definition} />;
  }
};
