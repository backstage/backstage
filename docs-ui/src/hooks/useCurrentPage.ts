'use client';

import { usePathname } from 'next/navigation';
import { getPageName } from '@/utils/getPageName';

export function useCurrentPage(): string | null {
  const pathname = usePathname();

  // Handle root path
  if (pathname === '/') {
    return 'Getting Started';
  }

  // Extract slug from various path patterns
  const patterns = [
    /^\/components\/(.+)$/, // /components/button
    /^\/theme\/(.+)$/, // /theme/typography
    /^\/about$/, // /about
    /^\/changelog$/, // /changelog
  ];

  for (const pattern of patterns) {
    const match = pathname.match(pattern);
    if (match) {
      const slug = match[1] || pathname.slice(1); // Use full path for exact matches
      return getPageName(slug);
    }
  }

  return null;
}
