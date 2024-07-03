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
import { useEffect } from 'react';

import { useShadowRootElements } from '@backstage/plugin-techdocs-react';
import { useNavigate } from 'react-router';

export const RedirectsAddon = () => {
  const links = useShadowRootElements(['a']) as HTMLLinkElement[];
  const navigate = useNavigate();
  const redirectLink =
    links.find(link => link.textContent?.startsWith('techdocs_redirect'))
      ?.href ?? undefined;

  useEffect(() => {
    if (!redirectLink) return;
    const docPath = redirectLink.replace(/^https?:\/\/[^\/]*/, '');
    navigate(docPath);
  }, [redirectLink, navigate]);

  return null;
};
