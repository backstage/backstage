export function tryToLoadCustomSidebar(ref) {
  try {
    return require(ref);
  } catch (e) {
    return [];
  }
}

export const catalogSidebar = tryToLoadCustomSidebar(
  '../../../docs/features/software-catalog/api/sidebar.ts',
);
export const searchSidebar = tryToLoadCustomSidebar(
  '../../../docs/features/search/api/sidebar.ts',
);
export const scaffolderSidebar = tryToLoadCustomSidebar(
  '../../../docs/features/software-templates/api/sidebar.ts',
);
