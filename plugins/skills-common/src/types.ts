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

/**
 * Represents a skill's metadata as defined by the Agent Skills specification.
 *
 * @public
 */
export interface Skill {
  /** Unique skill name. Lowercase alphanumeric and hyphens only. */
  name: string;
  /** Description of what the skill does and when to use it. */
  description: string;
  /** Optional license identifier. */
  license?: string;
  /** Optional compatibility requirements. */
  compatibility?: string;
  /** Optional arbitrary key-value metadata. */
  metadata?: Record<string, string>;
  /** Optional space-delimited list of pre-approved tools. */
  allowedTools?: string;
  /** Service principal subject that registered this skill. */
  source: string;
  /** When the skill was created. */
  createdAt: string;
  /** When the skill was last updated. */
  updatedAt: string;
}

/**
 * A file belonging to a skill.
 *
 * @public
 */
export interface SkillFile {
  /** File path relative to the skill directory, e.g. "SKILL.md" or "scripts/run.py". */
  path: string;
  /** File content. */
  content: string;
}

/**
 * A single skill with its files, used as input in batch registration.
 *
 * @public
 */
export interface SkillInput {
  /** Skill files. Must include at least a SKILL.md file. */
  files: SkillFile[];
}

/**
 * Request to register (replace) all skills for the calling plugin.
 *
 * @public
 */
export interface RegisterSkillsRequest {
  /** Array of skills to register. */
  skills: SkillInput[];
}

/**
 * Optional request behavior for client calls.
 *
 * @public
 */
export interface SkillsRequestOptions {
  /** Optional bearer token to attach to the request. */
  token?: string;
}

/**
 * Query parameters for listing skills.
 *
 * @public
 */
export interface SkillsListRequest {
  /** Optional search term to filter by name or description. */
  search?: string;
  /** Optional filter by the source that registered the skill. */
  source?: string;
  /** Number of items to skip. */
  offset?: number;
  /** Maximum number of items to return. */
  limit?: number;
  /** Field to order by. */
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  /** Order direction. */
  order?: 'asc' | 'desc';
}

/**
 * Paginated response for listing skills.
 *
 * @public
 */
export interface SkillsListResponse {
  /** Array of skills. */
  skills: Skill[];
  /** Total count of matching skills. */
  totalCount: number;
}

/**
 * Well-known index.json skill entry per the Agent Skills specification.
 *
 * @public
 */
export interface WellKnownSkillEntry {
  /** Skill name. */
  name: string;
  /** Skill description. */
  description: string;
  /** Array of file paths in the skill. */
  files: string[];
}

/**
 * Well-known index.json structure.
 *
 * @public
 */
export interface WellKnownIndex {
  /** Array of skill entries. */
  skills: WellKnownSkillEntry[];
}

/**
 * Interface for the skills API client.
 *
 * @public
 */
export interface SkillsApi {
  /** List skills with optional filters. */
  listSkills(
    request?: SkillsListRequest,
    requestOptions?: SkillsRequestOptions,
  ): Promise<SkillsListResponse>;
  /** Get a skill by name. */
  getSkill(name: string, requestOptions?: SkillsRequestOptions): Promise<Skill>;
  /** Get all files for a skill. */
  getSkillFiles(
    name: string,
    requestOptions?: SkillsRequestOptions,
  ): Promise<SkillFile[]>;
  /** Register (replace) all skills for the calling plugin. */
  registerSkills(
    request: RegisterSkillsRequest,
    requestOptions?: SkillsRequestOptions,
  ): Promise<Skill[]>;
}
