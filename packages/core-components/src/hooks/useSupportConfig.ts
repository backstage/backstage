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

import { useApiHolder, configApiRef } from '@backstage/core-plugin-api';
import { coreComponentsTranslationRef } from '../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export type SupportItemLink = {
  url: string;
  title: string;
};

export type SupportItem = {
  title: string;
  icon?: string;
  links: SupportItemLink[];
};

export type SupportConfig = {
  url: string;
  items: SupportItem[];
};

const useDefaultSupportConfig = () => {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  return {
    url: 'https://github.com/backstage/backstage/issues',
    items: [
      {
        title: t('supportConfig.default.title'),
        icon: 'warning',
        links: [
          {
            // TODO: Update to dedicated support page on backstage.io/docs
            title: t('supportConfig.default.linkTitle'),
            url: 'https://github.com/backstage/backstage/blob/master/app-config.yaml',
          },
        ],
      },
    ],
  };
};

export function useSupportConfig(): SupportConfig {
  const apiHolder = useApiHolder();
  const config = apiHolder.get(configApiRef);
  const supportConfig = config?.getOptionalConfig('app.support');
  const defaultSupportConfig = useDefaultSupportConfig();

  if (!supportConfig) {
    return defaultSupportConfig;
  }

  return {
    url: supportConfig.getString('url'),
    items: supportConfig.getConfigArray('items').flatMap(itemConf => ({
      title: itemConf.getString('title'),
      icon: itemConf.getOptionalString('icon'),
      links: (itemConf.getOptionalConfigArray('links') ?? []).flatMap(
        linkConf => ({
          url: linkConf.getString('url'),
          title: linkConf.getOptionalString('title') ?? '',
        }),
      ),
    })),
  };
}
