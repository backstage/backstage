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

import type React from 'react';

import { ScaffolderTemplateEditorClassKey } from './alpha/components/TemplateEditorPage/TemplateEditor';
import { ScaffolderTemplateFormPreviewerClassKey } from './alpha/components/TemplateEditorPage/TemplateFormPreviewer';
import { ScaffolderCustomFieldExplorerClassKey } from './alpha/components/TemplateEditorPage/CustomFieldExplorer';

/** @public */
export type ScaffolderReactComponentsNameToClassKey = {
  ScaffolderTemplateEditor: ScaffolderTemplateEditorClassKey;
  ScaffolderTemplateFormPreviewer: ScaffolderTemplateFormPreviewerClassKey;
  ScaffolderCustomFieldExplorer: ScaffolderCustomFieldExplorerClassKey;
};

/**
 * CSS custom property overrides for a component's class keys.
 * Each class key maps to a Record of CSS custom property names to values,
 * combined with standard React CSSProperties for inline style overrides.
 */
type CSSCustomPropertyOverride<ClassKey extends string> = {
  [K in ClassKey]?: React.CSSProperties & Record<`--${string}`, string>;
};

/** @public */
export type BackstageOverrides = {
  [Name in keyof ScaffolderReactComponentsNameToClassKey]?: Partial<
    CSSCustomPropertyOverride<ScaffolderReactComponentsNameToClassKey[Name]>
  >;
};

declare module '@backstage/theme' {
  interface OverrideComponentNameToClassKeys
    extends ScaffolderReactComponentsNameToClassKey {}
}
