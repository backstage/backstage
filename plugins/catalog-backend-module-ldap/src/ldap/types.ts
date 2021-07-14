/*
 * Copyright 2021 The Backstage Authors
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
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { SearchEntry } from 'ldapjs';
import { LdapVendor } from './vendors';
import { GroupConfig, UserConfig } from './config';

/**
 * Customize the ingested User entity
 *
 * @param vendor The LDAP vendor that can be used to find and decode vendor specific attributes
 * @param config The User specific config used by the default transformer.
 * @param user The found LDAP entry in its source format. This is the entry that you want to transform
 * @return A `UserEntity` or `undefined` if you want to ignore the found user for being ingested by the catalog
 */
export type UserTransformer = (
  vendor: LdapVendor,
  config: UserConfig,
  user: SearchEntry,
) => Promise<UserEntity | undefined>;

/**
 * Customize the ingested Group entity
 *
 * @param vendor The LDAP vendor that can be used to find and decode vendor specific attributes
 * @param config The Group specific config used by the default transformer.
 * @param group The found LDAP entry in its source format. This is the entry that you want to transform
 * @return A `GroupEntity` or `undefined` if you want to ignore the found group for being ingested by the catalog
 */
export type GroupTransformer = (
  vendor: LdapVendor,
  config: GroupConfig,
  group: SearchEntry,
) => Promise<GroupEntity | undefined>;
