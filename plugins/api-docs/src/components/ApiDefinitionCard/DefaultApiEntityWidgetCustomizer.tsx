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
import { ApiDefinitionWidgetCustomizer } from './ApiDefinitionCard';

export const DefaultApiEntityWidgetCustomizer: ApiDefinitionWidgetCustomizer = (
  entity,
  current,
) => {
  if (entity.spec.type === 'openapi') {
    if (
      entity.metadata?.annotations?.['backstage.io/disableTryItOut'] === 'true'
    ) {
      if (!current.props.plugins) {
        current.props.plugins = [];
      }
      current.props.plugins.push({
        statePlugins: {
          spec: {
            wrapSelectors: {
              allowTryItOutFor: () => () => false,
            },
          },
        },
      });
    }
    if (
      entity.metadata?.annotations?.['backstage.io/disableAuthorizeButton'] ===
      'true'
    ) {
      if (!current.props.plugins) {
        current.props.plugins = [];
      }
      current.props.plugins.push({
        wrapComponents: {
          authorizeBtn: () => () => false,
        },
      });
    }
  }

  return current;
};
