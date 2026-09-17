/*
 * Copyright 2026 The Backstage Authors
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

import { createContext, ReactNode, useContext } from 'react';
import { capitalize } from 'lodash';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';

type FormatContextType = {
  formatOriginName: (id: string) => string;
  formatTopicName: (id: string) => string;
};

const NotificationFormatContext = createContext<FormatContextType | undefined>(
  undefined,
);

export const useNotificationFormat = () => {
  const { t } = useTranslationRef(notificationsTranslationRef);
  const context = useContext(NotificationFormatContext);
  if (!context) throw new Error(t('settings.errors.useNotificationFormat'));
  return context;
};

export const NotificationFormatProvider = ({
  children,
  originMap,
  topicMap,
}: {
  children: ReactNode;
  originMap: Record<string, string> | undefined;
  topicMap: Record<string, string> | undefined;
}) => {
  const formatName = (
    id: string,
    nameMap: Record<string, string> | undefined,
  ) => {
    if (nameMap && id in nameMap) {
      return nameMap[id];
    }
    return capitalize(id.replaceAll(/[-_:]/g, ' '));
  };

  const formatOriginName = (originId: string) => {
    return formatName(originId, originMap);
  };

  const formatTopicName = (topicId: string) => {
    return formatName(topicId, topicMap);
  };

  return (
    <NotificationFormatContext.Provider
      value={{ formatOriginName, formatTopicName }}
    >
      {children}
    </NotificationFormatContext.Provider>
  );
};
