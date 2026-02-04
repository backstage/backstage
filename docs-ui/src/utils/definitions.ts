'use client';

/**
 * Client-side re-export of UI component definitions.
 *
 * The 'use client' directive here creates a boundary that prevents Next.js
 * from analyzing the transitive dependencies (hooks) during SSR/SSG.
 *
 * This allows the UI package to remain pure and free of Next.js-specific
 * directives while still working correctly in the Next.js App Router.
 */
export * from '../../../packages/ui/src/definitions';
