import { overview, coreConcepts, components, layoutComponents } from './data';

export function getPageName(slug: string): string | null {
  // Search in overview pages
  const overviewPage = overview.find(p => p.slug === slug);
  if (overviewPage) {
    return overviewPage.title;
  }

  // Search in core concepts array
  const coreConcept = coreConcepts.find(c => c.slug === slug);
  if (coreConcept) {
    return coreConcept.title;
  }

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
