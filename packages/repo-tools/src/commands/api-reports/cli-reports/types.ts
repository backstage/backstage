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

// Represents the help page os a CLI command
export type CliHelpPage = {
  // Path of commands to reach this page
  path: string[];
  // Parsed content
  usage: string | undefined;
  options: string[];
  commands: string[];
  commandArguments: string[];
};

// The API model for a CLI entry point
export type CliModel = {
  name: string;
  helpPages: CliHelpPage[];
};
