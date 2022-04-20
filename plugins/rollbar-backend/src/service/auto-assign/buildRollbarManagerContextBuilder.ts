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
import {RollbarCheckers, RollbarItem, RollbarManagerOptions} from "./type";

export const buildRollbarManagerContextBuilder = async (options: RollbarManagerOptions): Promise<RollbarCheckers> => {
  const {
    ownerChecks,
    config,
    logger,
  } = options;

  logger.info("Config for rollbar manager started")

  return {
    runChecks: async (rollbarItem: RollbarItem) => {
      for (let i = 0; i < ownerChecks.length; i++) {
        const ownerCheck = ownerChecks[i]
        const ownerUserId = await ownerCheck.check({
          config,
          logger
        }, rollbarItem).catch(error => {
          logger.error(`Error for checker id ${ownerCheck.id} : ${error}`);
        })

        if (ownerUserId) return Promise.resolve({ ownerUserId })
      }

      return Promise.reject();
    }
  }
}
