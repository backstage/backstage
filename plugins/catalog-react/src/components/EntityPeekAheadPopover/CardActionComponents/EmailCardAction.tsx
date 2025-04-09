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

import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import { Link } from '@backstage/core-components';
import { catalogReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Email Card action link
 *
 * @private
 */
export const EmailCardAction = (props: { email: string }) => {
  const { t } = useTranslationRef(catalogReactTranslationRef);
  return (
    <IconButton
      component={Link}
      aria-label="Email"
      title={t('entityPeekAheadPopover.emailCardAction.title', {
        email: props.email,
      })}
      to={t('entityPeekAheadPopover.emailCardAction.subTitle', {
        email: props.email,
      })}
    >
      <EmailIcon />
    </IconButton>
  );
};
