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

import { Progress } from '@backstage/core-components';
import React, { Suspense } from 'react';

// The WSDL will convert WSDL markup to HTML so only load it if
// necessary
const LazyWsdlDefinition = React.lazy(() =>
  import('./WsdlDefinition').then(m => ({
    default: m.WsdlDefinition,
  })),
);

/** @public */
export type WsdlDefinitionWidgetProps = {
  definition: string;
};

/** @public */
export const WsdlDefinitionWidget = (props: WsdlDefinitionWidgetProps) => {
  return (
    <Suspense fallback={<Progress />}>
      <LazyWsdlDefinition {...props} />
    </Suspense>
  );
};
