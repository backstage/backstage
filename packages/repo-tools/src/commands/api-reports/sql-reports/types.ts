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

import type { Knex } from 'knex';

export type SchemaColumnInfo = {
  name: string;
  type: string;
  nullable: boolean;
  maxLength: number | null;
  defaultValue: Knex.Value;
};

export type SchemaIndexInfo = {
  name: string;
  unique: boolean;
  primary: boolean;
  columns: string[];
};

export type SchemaTableInfo = {
  name: string;
  columns: Record<string, SchemaColumnInfo>;
  indices: Record<string, SchemaIndexInfo>;
};

export type SchemaSequenceInfo = {
  name: string;
  type: string;
};

export type SchemaInfo = {
  tables: Record<string, SchemaTableInfo>;
  sequences: Record<string, SchemaSequenceInfo>;
};
