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
import {
  useContent,
  ShadcnDialog,
  ShadcnDialogContent,
  ShadcnDialogTitle,
  ShadcnButton,
  Separator,
  VisuallyHidden,
  cn,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  SearchBar,
  SearchContextProvider,
  SearchResult,
  SearchResultPager,
} from '@backstage/plugin-search-react';
import { ArrowRight, X } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { rootRouteRef } from '../../plugin';
import { SearchResultSet } from '@backstage/plugin-search-common';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchTranslationRef } from '../../translation';

/**
 * @public
 */
export interface SearchModalChildrenProps {
  /**
   * A function that should be invoked when navigating away from the modal.
   */
  toggleModal: () => void;

  /**
   * Ability to provide custom components to render the result items
   */
  resultItemComponents?:
    | ReactNode
    | ((resultSet: SearchResultSet) => JSX.Element);
}

/**
 * @public
 */
export interface SearchModalProps {
  /**
   * If true, it renders the modal.
   */
  open?: boolean;
  /**
   * This is supposed to be used together with the open prop.
   * If `hidden` is true, it hides the modal.
   * If `open` is false, the value of `hidden` has no effect on the modal.
   * Use `open` for controlling whether the modal should be rendered or not.
   */
  hidden?: boolean;
  /**
   * a function invoked when a search item is pressed or when the dialog
   * should be closed.
   */
  toggleModal: () => void;
  /**
   * A function that returns custom content to render in the search modal in
   * place of the default.
   */
  children?: (props: SearchModalChildrenProps) => JSX.Element;

  /**
   * Optional ability to pass in result item component renderers.
   */
  resultItemComponents?: SearchModalChildrenProps['resultItemComponents'];
}

export const Modal = ({
  toggleModal,
  resultItemComponents,
}: SearchModalChildrenProps) => {
  const navigate = useNavigate();
  const { focusContent } = useContent();
  const { t } = useTranslationRef(searchTranslationRef);

  const searchRootRoute = useRouteRef(rootRouteRef)();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchBarRef?.current?.focus();
  });

  const handleSearchResultClick = useCallback(() => {
    // 195ms matches MUI's default leavingScreen transition duration
    setTimeout(focusContent, 195);
  }, [focusContent]);

  // This handler is called when "enter" is pressed
  const handleSearchBarSubmit = useCallback(() => {
    // Using ref to get the current field value without waiting for a query debounce
    const query = searchBarRef.current?.value ?? '';
    navigate(`${searchRootRoute}?query=${query}`);
    handleSearchResultClick();
  }, [navigate, handleSearchResultClick, searchRootRoute]);

  return (
    <>
      <div className="grid items-center grid-cols-[1fr_auto] gap-2 p-6 pb-2 [&>button]:mt-2">
        <SearchBar
          className="flex-1"
          ref={searchBarRef}
          onSubmit={handleSearchBarSubmit}
        />
        <ShadcnButton
          variant="ghost"
          size="icon"
          aria-label="close"
          onClick={toggleModal}
        >
          <X className="h-4 w-4" />
        </ShadcnButton>
      </div>
      <div className="flex-1 overflow-y-auto px-6">
        <div className="flex flex-row-reverse justify-start items-center">
          <ShadcnButton
            variant="ghost"
            className="hover:bg-transparent"
            onClick={handleSearchBarSubmit}
          >
            {t('searchModal.viewFullResults')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </ShadcnButton>
        </div>
        <Separator />
        <SearchResult
          onClick={handleSearchResultClick}
          onKeyDown={handleSearchResultClick}
        >
          {resultItemComponents}
        </SearchResult>
      </div>
      <div className="px-6 py-2">
        <div className="w-full">
          <SearchResultPager />
        </div>
      </div>
    </>
  );
};

/**
 * @public
 */
export const SearchModal = (props: SearchModalProps) => {
  const {
    open = true,
    hidden,
    toggleModal,
    children,
    resultItemComponents,
  } = props;

  // Bind Ctrl+K / Cmd+K global keyboard shortcut to open the search modal.
  // Per AAP §0.4.2 the Command dialog should be activated by Cmd/Ctrl+K,
  // providing the Discord/Linear-style search experience.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleModal]);

  const content = open ? (
    <SearchContextProvider inheritParentContextIfAvailable>
      {(children &&
        children({
          toggleModal,
          resultItemComponents: resultItemComponents || [],
        })) ?? (
        <Modal
          toggleModal={toggleModal}
          resultItemComponents={resultItemComponents}
        />
      )}
    </SearchContextProvider>
  ) : null;

  // When hidden is true, render content in a hidden container to maintain DOM
  // presence for backward compatibility (e.g., tests expecting search bar to
  // be in the document but not visible). This avoids rendering the overlay
  // backdrop when the dialog content should not be shown.
  if (hidden) {
    return <div hidden>{content}</div>;
  }

  return (
    <ShadcnDialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) toggleModal();
      }}
    >
      <ShadcnDialogContent
        className={cn(
          'max-w-4xl h-[calc(100%-128px)] flex flex-col p-0',
          '[&>button.absolute]:hidden',
        )}
        aria-label="Search Modal"
      >
        {/* Visually hidden DialogTitle required by Radix Dialog for screen
            reader accessibility (Issue #5). Without this, Radix emits a
            console warning about a missing DialogTitle. */}
        <VisuallyHidden>
          <ShadcnDialogTitle>Search</ShadcnDialogTitle>
        </VisuallyHidden>
        {content}
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
};
