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
import { Entity } from '@backstage/catalog-model';

export const ALLURE_PROJECT_ID_ANNOTATION = 'qameta.io/allure-project';

export const isAllureReportAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[ALLURE_PROJECT_ID_ANNOTATION]);

export const getAllureProjectId = (entity: Entity) => {
  return entity?.metadata.annotations?.[ALLURE_PROJECT_ID_ANNOTATION] ?? '';
};
