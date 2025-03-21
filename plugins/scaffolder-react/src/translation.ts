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
import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const scaffolderReactTranslationRef = createTranslationRef({
  id: 'scaffolder-react',
  messages: {
    passwordWidget: {
      content:
        'This widget is insecure. Please use [`ui:field: Secret`](https://backstage.io/docs/features/software-templates/writing-templates/#using-secrets) instead of `ui:widget: password`',
    },
    scaffolderPageContextMenu: {
      moreLabel: 'more',
      createLabel: 'Create',
      editorLabel: 'Manage Templates',
      actionsLabel: 'Installed Actions',
      tasksLabel: 'Task List',
    },
    stepper: {
      backButtonText: 'Back',
      createButtonText: 'Create',
      reviewButtonText: 'Review',
      stepIndexLabel: 'Step {{index, number}}',
      nextButtonText: 'Next',
    },
    templateCategoryPicker: {
      title: 'Categories',
    },
    templateCard: {
      noDescription: 'No description',
      chooseButtonText: 'Choose',
    },
    cardHeader: {
      detailBtnTitle: 'Show template entity details',
    },
    templateOutputs: {
      title: 'Text Output',
    },
    workflow: {
      noDescription: 'No description',
    },
  },
});
