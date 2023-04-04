/*
 * Copyright 2023 The Backstage Authors
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
import { errorHandler, PluginDatabaseManager } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { databaseConnection } from '../DatabaseHandler';
import { GithubService } from './Github.service';

/**
 * @internal
 */
export type User = {
  identity: {
    type: string;
    userEntityRef: string;
    ownershipEntityRefs: string[];
  };
};
/**
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  database: PluginDatabaseManager;
  config?: Config;
  identity?: IdentityApi;
}
const DEFAULT_USER = {
  identity: {
    type: 'guest',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: ['user:default/guest'],
  },
};
/**
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, identity, database, config } = options;
  const dbClient = await databaseConnection({ database } as {
    database: PluginDatabaseManager;
  });
  dbClient
    .raw('select 1+1 as result')
    .then(() => {})
    .catch((err: any) => {
      logger.error(err);
      process.exit(1);
    });
  const urls = config?.getOptionalConfigArray('catalog.locations');
  let baseRepo = '';
  urls?.forEach(location => {
    const type = location.getString('type');
    if (type === 'onboarding-repo-url') {
      baseRepo = location.getString('target');
    }
  });

  const router = Router();
  router.use(express.json());
  /**
   * @public
   */
  router.get('/getChecklists', async (req, res) => {
    try {
      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      const userId = user?.identity?.userEntityRef;
      let { groups, roles } = req.query;
      groups = (groups as string) || 'asro';
      roles = (roles as string) || '';
      let roleQuery = '';
      /**
       * Creating role base query
       */
      if (roles?.length) {
        roles.split(',').forEach((val: string) => {
          roleQuery += `${
            roleQuery.length ? ' or' : ''
          } “forRoles” Ilike '%${val}%'`;
        });
      }
      let newChecklist: any = {};
      const prevData = await dbClient
        .select()
        .from('checklistResponse')
        .where({ user: userId });
      const checklists = await dbClient('checklists')
        .whereIn('group', groups.split(','))
        .whereRaw(roleQuery);
      let showModal = true;
      const statusArr = prevData.map((item: any) => item.isDone);
      if (statusArr?.length) showModal = statusArr.some((val: any) => !!!val);
      if (!checklists?.length) showModal = false;
      if (checklists?.length) {
        checklists.forEach((value: any) => {
          const obj = { ...newChecklist };
          obj[value.group] = {};
          if (newChecklist.hasOwnProperty(value.group)) {
            obj[value.group] = { ...newChecklist[value.group] };
          }
          const prevItem = prevData.find(
            (it: any) => it.checklist_uid === value.checklist_uid,
          );
          const formData = JSON.parse(value.formSchema);
          obj[value.group][value.title] = formData.map((val: any) => {
            val.checklist_uid = value?.checklist_uid;
            val.isDone =
              (prevItem && JSON.parse(prevItem.userResponse)[val.id]) || false;
            val.checklistHash = value?.checklistHash;
            return val;
          });
          newChecklist = { ...obj };
        });
      }
      res.json({ data: newChecklist, showModal });
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });
  /**
   * @public
   */
  router.put('/updateStatus', async (req, res) => {
    try {
      const {
        checklistHash,
        isDone,
        userResponse,
        progressStatus,
        checklist_uid: uid,
      } = req.body;
      const user =
        (identity && (await identity.getIdentity({ request: req }))) ||
        DEFAULT_USER;
      req.body.user = user.identity.userEntityRef;
      const prevData = await dbClient
        .select()
        .from('checklistResponse')
        .where({ checklist_uid: uid })
        .first();
      /**
       * Updating previous checklist response
       */
      if (prevData?.checklist_uid) {
        await dbClient('checklistResponse')
          .update({
            isDone,
            progressStatus,
            userResponse,
            checklistHash,
          })
          .where({ checklist_uid: uid })
          .debug(true);
        res.json({ message: 'updated' }).status(200);
      } else {
        /**
         * Adding new checklist response
         */
        await dbClient.insert(req.body).into('checklistResponse');
      }
      res.json({ message: 'Done' }).status(200);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  });
  /**
   * @public
   * Syncing data from github repository
   */
  router.get('/syncYaml', async (_req, res) => {
    try {
      const GitService = new GithubService({ baseRepo: baseRepo || '' });
      const data: any[] = await GitService.GetUserAndChecklistBlob();
      const salt = 10;
      data?.forEach(async res_data => {
        const hash = await bcrypt.hash(res_data.formSchema, salt);
        res_data.checklistHash = hash;
        const prevData = await dbClient
          .select()
          .from('checklists')
          .where({ checklist_uid: res_data.checklist_uid })
          .first();
        /**
         * Syncing previous checklist with new data
         */
        if (prevData) {
          if (prevData.groupHash !== res_data.groupHash) {
            await dbClient('checklists')
              .where({ checklist_uid: prevData.checklist_uid })
              .update({
                groupHash: res_data.groupHash,
                forRoles: res_data.forRoles,
                title: res_data.title,
                formSchema: res_data.formSchema,
                updated_at: dbClient.fn.now(),
                checklistHash: res_data.checklistHash,
              });
          }
        } else {
          /**
           * Inserting new checklist data
           */
          await dbClient('checklists').insert(res_data);
        }
      });
      res.json('Sync is on progress...').status(200);
    } catch (error) {
      res.status(500).send('Internal server error!');
    }
  });
  router.get('/health', (_, response) => {
    logger.info('PONG!');
    response.send({ status: 'ok' });
  });
  router.use(errorHandler());
  return router;
}
