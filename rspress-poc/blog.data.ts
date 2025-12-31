// Blog data loader for RSPress
// This demonstrates how to implement blog functionality using RSPress's data loading API

import fs from 'fs';
import path from 'path';
import { defineLoader } from 'rspress/runtime';

export interface BlogPost {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  author?: string;
}

export default defineLoader(async () => {
  const blogDir = path.join(__dirname, '../microsite/blog');

  try {
    if (!fs.existsSync(blogDir)) {
      return [];
    }

    const files = fs.readdirSync(blogDir);
    const posts: BlogPost[] = files
      .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
      .map(file => {
        const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(mdx?|md)$/);
        if (!match) return null;

        const [, date, slug] = match;
        const filePath = path.join(blogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract title from frontmatter or first heading
        const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/) ||
                          content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ');

        // Extract first paragraph as excerpt
        const excerptMatch = content.match(/\n\n([^#\n][^\n]+)\n/);
        const excerpt = excerptMatch ? excerptMatch[1].substring(0, 200) + '...' : '';

        return {
          title,
          date,
          slug,
          excerpt,
        };
      })
      .filter(Boolean) as BlogPost[];

    posts.sort((a, b) => b.date.localeCompare(a.date));

    return posts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
});
