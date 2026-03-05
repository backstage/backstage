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

import { Entity } from '@backstage/catalog-model';
import { CodeSnippet } from '@backstage/core-components';
import DialogContentText from '@material-ui/core/DialogContentText';
import { sortKeys } from './util';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export function JsonPage(props: { entity: Entity }) {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <>
      <DialogContentText variant="h2">
        {t('inspectEntityDialog.jsonPage.title')}
      </DialogContentText>
      <DialogContentText>
        {t('inspectEntityDialog.jsonPage.description')}
      </DialogContentText>
      <DialogContentText>
        <div style={{ fontSize: '75%' }} data-testid="code-snippet">
          <CodeSnippet
            text={JSON.stringify(sortKeys(props.entity), undefined, 2)}
            language="json"
            showCopyCodeButton
          />
        </div>
      </DialogContentText>
    </>
  );
}
