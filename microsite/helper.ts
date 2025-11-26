export function makeGeneratedIndexCategory(
  label: string,
  slug: string,
  items: (string | object)[],
  title: string = label,
) {
  return {
    type: 'category',
    label,
    link: { type: 'generated-index', title, slug: `/${slug}` },
    items,
  };
}

export function makeApiCategory(
  featureName: string,
  sidebar: (string | object)[],
) {
  const slug = `/category/${featureName
    .toLowerCase()
    .replace(/\s+/g, '-')}-api`;
  return {
    type: 'category',
    label: 'API',
    link:
      sidebar && sidebar.length > 0
        ? { type: 'generated-index', title: `${featureName} API`, slug }
        : { type: 'doc', id: 'openapi/generated-docs/404' },
    items: sidebar ?? [],
  };
}

export function makeProviderCategory(
  label: string,
  slug: string,
  items: (string | object)[],
) {
  return makeGeneratedIndexCategory(label, slug, items, label);
}
