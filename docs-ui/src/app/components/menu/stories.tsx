'use client';

import * as stories from '@backstage/ui/src/components/Menu/Menu.stories';

const {
  Preview: PreviewStory,
  PreviewSubmenu: PreviewSubmenuStory,
  PreviewIcons: PreviewIconsStory,
  PreviewLinks: PreviewLinksStory,
  PreviewSections: PreviewSectionsStory,
  PreviewSeparators: PreviewSeparatorsStory,
  PreviewAutocompleteMenu: PreviewAutocompleteMenuStory,
  PreviewAutocompleteListbox: PreviewAutocompleteListboxStory,
  PreviewAutocompleteListboxMultiple: PreviewAutocompleteListboxMultipleStory,
} = stories;

export const Preview = () => <PreviewStory.Component />;
export const PreviewSubmenu = () => <PreviewSubmenuStory.Component />;
export const PreviewIcons = () => <PreviewIconsStory.Component />;
export const PreviewLinks = () => <PreviewLinksStory.Component />;
export const PreviewSections = () => <PreviewSectionsStory.Component />;
export const PreviewSeparators = () => <PreviewSeparatorsStory.Component />;
export const PreviewAutocompleteMenu = () => (
  <PreviewAutocompleteMenuStory.Component />
);
export const PreviewAutocompleteListbox = () => (
  <PreviewAutocompleteListboxStory.Component />
);
export const PreviewAutocompleteListboxMultiple = () => (
  <PreviewAutocompleteListboxMultipleStory.Component />
);
