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

import { Config } from '@backstage/config';
import { createExternalTokenHandler } from './helpers';

const MIN_TOKEN_LENGTH = 8;

export const staticTokenHandler = createExternalTokenHandler<{
  token: string;
  subject: string;
}>({
  type: 'static',
  initialize(ctx: { options: Config }): { token: string; subject: string } {
    const token = ctx.options.getString('token');
    const subject = ctx.options.getString('subject');

    if (!token.match(/^\S+$/)) {
      throw new Error('Illegal token, must be a set of non-space characters');
    } else if (token.length < MIN_TOKEN_LENGTH) {
      throw new Error(
        `Illegal token, must be at least ${MIN_TOKEN_LENGTH} characters length`,
      );
    } else if (!subject.match(/^\S+$/)) {
      throw new Error('Illegal subject, must be a set of non-space characters');
    }

    return { token, subject };
  },
  async verifyToken(
    token: string,
    context: { token: string; subject: string },
  ) {
    if (token === context.token) {
      return { subject: context.subject };
    }
    return undefined;
  },
});
