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
import { Search } from 'lucide-react';
import { SidebarItem } from '@backstage/core-components';
import { IconComponent } from '@backstage/core-plugin-api';
import {
  SearchModal,
  SearchModalProps,
  SearchModalProvider,
  useSearchModal,
} from '../SearchModal';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchTranslationRef } from '../../translation';

/** Map MUI-style fontSize values to Lucide pixel sizes */
const ICON_SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 35,
  inherit: 24,
};

/**
 * Wraps the lucide-react Search icon to conform to Backstage's IconComponent type.
 * Lucide icons use LucideProps (size, strokeWidth, etc.) while IconComponent expects
 * { fontSize?: 'medium' | 'large' | 'small' | 'inherit' }.
 */
const SearchIcon: IconComponent = ({ fontSize = 'medium', ...rest }) => (
  <Search size={ICON_SIZE_MAP[fontSize] ?? 24} {...rest} />
);

/**
 * Props for {@link SidebarSearchModal}.
 *
 * @public
 */
export type SidebarSearchModalProps = Pick<
  SearchModalProps,
  'children' | 'resultItemComponents'
> & {
  icon?: IconComponent;
};

const SidebarSearchModalContent = (props: SidebarSearchModalProps) => {
  const { state, toggleModal } = useSearchModal();
  const Icon = props.icon ? props.icon : SearchIcon;
  const { t } = useTranslationRef(searchTranslationRef);

  return (
    <>
      <SidebarItem
        className="search-icon"
        icon={Icon}
        text={t('sidebarSearchModal.title')}
        onClick={toggleModal}
      />
      <SearchModal
        {...state}
        toggleModal={toggleModal}
        resultItemComponents={props.resultItemComponents}
        children={props.children}
      />
    </>
  );
};

export const SidebarSearchModal = (props: SidebarSearchModalProps) => {
  return (
    <SearchModalProvider>
      <SidebarSearchModalContent {...props} />
    </SearchModalProvider>
  );
};
