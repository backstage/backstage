/*
 * Copyright 2022 The Backstage Authors
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

import { EmailCardAction } from './EmailCardAction';
import React from 'react';
import { UserEntity } from '@backstage/catalog-model';

/**
 * Card actions that show for a user
 *
 * @private
 */
export const UserCardActions = (props: { entity: UserEntity }) => {
  const email = props.entity.spec.profile?.email;
  return email ? <EmailCardAction email={email} /> : null;
};
