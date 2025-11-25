export function tryToLoadCustomSidebar(ref: string): any[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(ref);
  } catch (e) {
    return [];
  }
}
