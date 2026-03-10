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

/** @internal */
export interface SkillRow {
  name: string;
  description: string;
  license: string | null;
  compatibility: string | null;
  metadata: string | null;
  allowed_tools: string | null;
  source: string;
  created_at: Date;
  updated_at: Date;
}

/** @internal */
export interface SkillFileRow {
  skill_name: string;
  path: string;
  content: string;
}

/** @internal */
export interface SkillsListOptions {
  search?: string;
  source?: string;
  offset?: number;
  limit?: number;
  orderBy?: 'name' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
}

/** @internal */
export interface SkillsStore {
  getSkill(name: string): Promise<SkillRow | undefined>;

  getSkillFiles(name: string): Promise<SkillFileRow[]>;

  getSkillFile(name: string, path: string): Promise<SkillFileRow | undefined>;

  listSkills(options: SkillsListOptions): Promise<{
    skills: SkillRow[];
    totalCount: number;
  }>;

  replaceSkillsForSource(
    source: string,
    skills: Array<{
      skill: Omit<SkillRow, 'created_at' | 'updated_at'>;
      files: SkillFileRow[];
    }>,
  ): Promise<SkillRow[]>;

  getAllSkillsForIndex(): Promise<
    Array<{ name: string; description: string; files: string[] }>
  >;
}
