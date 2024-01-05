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
export type MessagesInsert = {
  origin: string;
  title: string;
  message?: string;
  topic?: string;
  is_system: boolean;
};

export type ActionsInsert = {
  message_id: string;
  title: string;
  url: string;
};

export function dbValToBoolean(val: any): boolean {
  if (!val) {
    return false;
  }

  const valStr = val.toString();

  switch (valStr) {
    case 'true':
    case 'TRUE':
    case '1':
      return true;
    case 'false':
    case 'FALSE':
    case '0':
      return false;
    default:
      throw new Error(`${valStr} is not a boolean value`);
  }
}
