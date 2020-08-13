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

import React, { FC, useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export const OpenApiDefinitionWidget: FC<{
  definition: any;
}> = ({ definition }) => {
  // Due to a bug in the swagger-ui-react component, the component needs
  // to be created without content first.
  const [def, setDef] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDef(definition), 0);
    return () => clearTimeout(timer);
  }, [definition, setDef]);

  // TODO: This looks fine in the light theme, but wrong in dark mode. We need a custom stylesheet for swagger-ui.
  // Till then, we add a white background to the swagger-ui to make it usable in dark mode.
  return (
    <div style={{ backgroundColor: 'white' }}>
      <SwaggerUI spec={def} />
    </div>
  );
};
