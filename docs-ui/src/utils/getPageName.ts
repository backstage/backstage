import { components } from './data';

export function getPageName(slug: string): string | null {
  const component = components.find(c => c.slug === slug);
  if (component) {
    return component.title;
  }

  return null;
}
