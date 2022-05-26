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

/**
 * Properties for creating an issue in a remote issue tracker.
 *
 * @public
 */
export type ReportIssueTemplate = {
  /**
   * The title of the issue.
   */
  title: string;

  /**
   * The body or description of the issue.
   */
  body: string;
};

/**
 * A function for returning a custom issue template, given a selection of text
 * on a TechDocs page.
 *
 * @public
 */
export type ReportIssueTemplateBuilder = ({
  selection,
}: {
  selection: Selection;
}) => ReportIssueTemplate;

export type Repository = {
  type: string;
  name: string;
  owner: string;
  protocol: string;
  resource: string;
};
