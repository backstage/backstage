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
 * Type representing a stack overflow question
 *
 * @public
 */
export type StackOverflowQuestion = {
  title: string;
  link: string;
  owner: Record<string, string>;
  tags: string[];
  answer_count: number;
};

/**
 * Props for HomePageStackOverflowQuestions
 *
 * @public
 */
export type StackOverflowQuestionsContentProps = {
  requestParams: StackOverflowQuestionsRequestParams;
  icon?: React.ReactNode;
};

/**
 * Type representing the request parameters accepted by the HomePageStackOverflowQuestions component
 *
 * @public
 */
export type StackOverflowQuestionsRequestParams = {
  [key: string]: string | string[] | number;
};
