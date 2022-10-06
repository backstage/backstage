/*
 * Copyright 2020 The Backstage Authors
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

import {
  AnalyzeLocationRequest as ExaltedAnalyzeLocationRequest,
  AnalyzeLocationResponse as ExaltedAnalyzeLocationResponse,
  AnalyzeLocationExistingEntity as ExaltedAnalyzeLocationExistingEntity,
  AnalyzeLocationGenerateEntity as ExaltedAnalyzeLocationGenerateEntity,
  AnalyzeLocationEntityField as ExaltedAnalyzeLocationEntityField,
} from '@backstage/plugin-catalog-common';

/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationRequest = ExaltedAnalyzeLocationRequest;
/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationResponse = ExaltedAnalyzeLocationResponse;

/**
 * If the folder pointed to already contained catalog info yaml files, they are
 * read and emitted like this so that the frontend can inform the user that it
 * located them and can make sure to register them as well if they weren't
 * already
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationExistingEntity =
  ExaltedAnalyzeLocationExistingEntity;
/**
 * This is some form of representation of what the analyzer could deduce.
 * We should probably have a chat about how this can best be conveyed to
 * the frontend. It'll probably contain a (possibly incomplete) entity, plus
 * enough info for the frontend to know what form data to show to the user
 * for overriding/completing the info.
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationGenerateEntity =
  ExaltedAnalyzeLocationGenerateEntity;

/**
 *
 * This is where I get really vague. Something like this perhaps? Or it could be
 * something like a json-schema that contains enough info for the frontend to
 * be able to present a form and explanations
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationEntityField = ExaltedAnalyzeLocationEntityField;

/** @public */
export type LocationAnalyzer = {
  /**
   * Generates an entity configuration for given git repository. It's used for
   * importing new component to the backstage app.
   *
   * @param location - Git repository to analyze and generate config for.
   */
  analyzeLocation(
    location: AnalyzeLocationRequest,
  ): Promise<AnalyzeLocationResponse>;
};
/** @public */
export type AnalyzeOptions = {
  url: string;
  catalogFilename?: string;
};

/** @public */
export type ScmLocationAnalyzer = {
  /** The method that decides if this analyzer can work with the provided url */
  supports(url: string): boolean;
  /** This function can return an array of already existing entities */
  analyze(options: AnalyzeOptions): Promise<{
    existing: AnalyzeLocationExistingEntity[];
  }>;
};
