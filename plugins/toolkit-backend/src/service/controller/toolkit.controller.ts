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
import { Response } from 'express';
import { Knex } from 'knex';

export const createUpdateToolkit = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const user = req.user;
    req.body.owner = user.identity.userEntityRef;
    if (req.params.id) {
      const { logo, title, url, type } = req.body;
      const toolkit = await client('toolkit')
        .update({
          title,
          logo,
          url,
          type,
        })
        .where({ id: req.params.id });
      if (toolkit) {
        if (type === 'private') {
          await client('toolkit_item')
            .where({ toolkit: req.params.id })
            .whereNot({ user: user.identity.userEntityRef })
            .delete();
        }
        res.status(200).send('Updated');
      } else {
        res.status(400).send('Something went wrong');
      }
    } else {
      const toolkit = await client
        .insert(req.body)
        .into('toolkit')
        .returning('id');
      if (toolkit.length) {
        const { id } = toolkit[0];
        await client
          .insert({
            toolkit: id,
            isPrivate: req.body.type === 'private',
            user: req.body.owner,
          })
          .into('toolkit_item');
        res.status(200).send('Created');
      } else {
        res.status(400).send('Something went wrong');
      }
    }
  } catch (error: any) {
    res.status(500).send('Internal server error!');
  }
};

export const addToolkit = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const { toolkits } = req.body;
    const user = req.user.identity.userEntityRef;
    const toolkitData: any[] = [];
    const previousData = await client('toolkit_item')
      .where({ user })
      .select('toolkit');
    const checkIsExists = await client('toolkit')
      .whereIn('id', toolkits)
      .where({ type: 'public' });
    toolkits.forEach((_id: number) => {
      const checkPrev = previousData.find(({ toolkit }) => toolkit === _id);
      const checkExists = checkIsExists.find(({ id }) => id === _id);
      if (!checkPrev && checkExists) {
        toolkitData.push({
          toolkit: checkExists.id,
          isPrivate: false,
          user: user,
        });
      }
    });

    if (toolkitData?.length) {
      await client.insert([...toolkitData]).into('toolkit_item');
      res.send('Toolkits added successfully');
    } else {
      res.send('No Toolkits founded or already exists');
    }
  } catch (error: any) {
    res.status(500).send('Internal server error!');
  }
};

export const myToolkits = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const user = req.user;
    const userId = user.identity.userEntityRef;
    const condition: any = {
      'toolkit_item.user': userId,
    };

    const data = await client('toolkit_item')
      .where(condition)
      .innerJoin('toolkit', 'toolkit.id', 'toolkit_item.toolkit');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Internal server error!');
  }
};

export const toolkitById = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const data = await client('toolkit').where({ id: req.params.id }).first();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Internal server error!');
  }
};

export const getToolkits = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const user = req.user.identity.userEntityRef;

    let toolOfUser = await client('toolkit_item')
      .where({ 'toolkit_item.user': user })
      .select('toolkit');
    toolOfUser = toolOfUser.map(({ toolkit }) => toolkit);

    const data = await client('toolkit_item')
      .whereNot({ 'toolkit_item.user': user, 'toolkit.type': 'private' })
      .whereNotIn('toolkit.id', toolOfUser)
      .innerJoin('toolkit', 'toolkit.id', 'toolkit_item.toolkit');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Internal server error!');
  }
};

export const deleteToolkitById = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const user = req.user;
    const { id } = req.params;

    const data = await client('toolkit')
      .where({ id, owner: user.identity.userEntityRef })
      .delete();
    if (data) {
      res.status(200).send('Deleted Successfully');
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (error) {
    res.status(500).send('Internal server error!');
  }
};

export const removeToolkit = async (req: any, res: Response) => {
  try {
    const client = req.dbClient as Knex<any, any[]>;
    const user = req.user.identity.userEntityRef;
    const { toolkit } = req.params;

    const data = await client('toolkit_item').where({ toolkit, user }).delete();
    if (data) {
      res.status(200).send('Removed Successfully');
    } else {
      res.status(400).send('Invalid request');
    }
  } catch (error) {
    res.status(500).send('Internal server error!');
  }
};
