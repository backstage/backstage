/*
 * Copyright 2024 The Backstage Authors
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

import castArray from 'lodash/castArray';
import { parseEntityRef } from '@backstage/catalog-model';
import { NotificationRecipients } from '@backstage/plugin-notifications-node';
import { NotificationPayload } from '@backstage/plugin-notifications-common';

// Will throw an error if malformed
const isEntityRef = (test: string) => !!parseEntityRef(test);

// We do not duplicate validation by the NotificationsService. Just making sure we do not pass something dangerous.
export const validateRecipients = (
  input?: any,
): NotificationRecipients | undefined => {
  if (['entity', 'broadcast'].includes(input?.type)) {
    if (!input.entityRef || castArray(input.entityRef).every(isEntityRef)) {
      return {
        type: input.type,
        entityRef: input.entityRef,
      };
    }
  }

  return undefined;
};

const allStringProps = [
  'title',
  'description',
  'link',
  'severity',
  'topic',
  'scope',
  'icon',
];

export const validatePayload = (
  input?: any,
): NotificationPayload | undefined => {
  if (
    input &&
    allStringProps.every(
      propName =>
        input[propName] === undefined || typeof input[propName] === 'string',
    ) &&
    Object.keys(input).every(propName => allStringProps.includes(propName))
  ) {
    return { ...input };
  }

  return undefined;
};
