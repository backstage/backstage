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
 * Project skills directories per agent ID, copied from the agent table in
 * `skills` 1.7.0 (`skillsDir` in node_modules/skills/dist/cli.mjs). The
 * `skills` package does not export this table, so it is pinned here and a
 * test compares it with the installed package to catch drift. Agents that
 * are not listed are never treated as having skills installed.
 */
export const AGENT_SKILLS_DIRS: Record<string, string> = {
  'aider-desk': '.aider-desk/skills',
  amp: '.agents/skills',
  antigravity: '.agents/skills',
  'antigravity-cli': '.agents/skills',
  astrbot: 'data/skills',
  'autohand-code': '.autohand/skills',
  augment: '.augment/skills',
  bob: '.bob/skills',
  'claude-code': '.claude/skills',
  openclaw: 'skills',
  cline: '.agents/skills',
  'codearts-agent': '.codeartsdoer/skills',
  codebuddy: '.codebuddy/skills',
  codemaker: '.codemaker/skills',
  codestudio: '.codestudio/skills',
  codex: '.agents/skills',
  'command-code': '.commandcode/skills',
  continue: '.continue/skills',
  cortex: '.cortex/skills',
  crush: '.crush/skills',
  cursor: '.agents/skills',
  deepagents: '.agents/skills',
  devin: '.devin/skills',
  dexto: '.agents/skills',
  droid: '.agents/skills',
  eve: 'agent/skills',
  firebender: '.agents/skills',
  forgecode: '.forge/skills',
  fx: '.fx/skills',
  'gemini-cli': '.agents/skills',
  'github-copilot': '.agents/skills',
  goose: '.goose/skills',
  grok: '.grok/skills',
  'hermes-agent': '.hermes/skills',
  'inference-sh': '.inferencesh/skills',
  jazz: '.jazz/skills',
  junie: '.junie/skills',
  'iflow-cli': '.iflow/skills',
  kilo: '.agents/skills',
  kimchi: '.kimchi/skills',
  'kimi-code-cli': '.agents/skills',
  'kiro-cli': '.kiro/skills',
  kode: '.kode/skills',
  lingma: '.lingma/skills',
  loaf: '.agents/skills',
  mcpjam: '.mcpjam/skills',
  'minimax-code': '.minimax/skills',
  'mistral-vibe': '.vibe/skills',
  moxby: '.moxby/skills',
  mux: '.mux/skills',
  opencode: '.agents/skills',
  openhands: '.openhands/skills',
  ona: '.ona/skills',
  pi: '.pi/skills',
  'posit-assistant': '.posit/assistant/skills',
  qoder: '.qoder/skills',
  'qoder-cn': '.qoder/skills',
  'qwen-code': '.qwen/skills',
  replit: '.agents/skills',
  reasonix: '.reasonix/skills',
  rovodev: '.rovodev/skills',
  roo: '.roo/skills',
  'sarvam-code': '.agents/skills',
  'tabnine-cli': '.tabnine/agent/skills',
  terramind: '.terramind/skills',
  tinycloud: '.tinycloud/skills',
  trae: '.trae/skills',
  'trae-cn': '.trae/skills',
  warp: '.agents/skills',
  windsurf: '.windsurf/skills',
  zed: '.agents/skills',
  zcode: '.zcode/skills',
  zencoder: '.zencoder/skills',
  zenflow: '.zencoder/skills',
  neovate: '.neovate/skills',
  pochi: '.pochi/skills',
  promptscript: '.agents/skills',
  adal: '.adal/skills',
  universal: '.agents/skills',
};
