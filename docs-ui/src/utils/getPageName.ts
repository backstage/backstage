import { components, layoutComponents } from './data';

export function getPageName(slug: string): string | null {
  // Search in components array
  const component = components.find(c => c.slug === slug);
  if (component) {
    return component.title;
  }

  // Search in layoutComponents array
  const layoutComponent = layoutComponents.find(c => c.slug === slug);
  if (layoutComponent) {
    return layoutComponent.title;
  }

  return null;
}
