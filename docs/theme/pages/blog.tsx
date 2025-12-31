import React, { useMemo, useState } from 'react';

// Blog post metadata extracted from filenames
// Format: YYYY-MM-DD-slug.mdx
interface BlogPost {
  date: string;
  slug: string;
  title: string;
  year: number;
  month: number;
  day: number;
}

// Use require.context to get all blog post filenames
const blogContext = require.context(
  '../../../docs/blog/posts',
  false,
  /\.mdx?$/
);

// Parse blog posts from filenames
const blogPosts: BlogPost[] = blogContext.keys()
  .map((key: string) => {
    // key format: ./YYYY-MM-DD-slug.mdx
    const filename = key.replace('./', '').replace(/\.mdx?$/, '');
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);

    if (!match) return null;

    const [, year, month, day, slug] = match;

    // Convert slug to title (capitalize words, replace hyphens with spaces)
    const title = slug
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      date: `${year}-${month}-${day}`,
      slug: filename,
      title,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
    };
  })
  .filter((post): post is BlogPost => post !== null)
  .sort((a, b) => {
    // Sort by date descending (newest first)
    if (a.year !== b.year) return b.year - a.year;
    if (a.month !== b.month) return b.month - a.month;
    return b.day - a.day;
  });

// Group posts by year
const postsByYear = blogPosts.reduce((acc, post) => {
  if (!acc[post.year]) {
    acc[post.year] = [];
  }
  acc[post.year].push(post);
  return acc;
}, {} as Record<number, BlogPost[]>);

const years = Object.keys(postsByYear)
  .map(Number)
  .sort((a, b) => b - a);

// Format date for display
const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPage = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredPosts = useMemo(() => {
    if (selectedYear === null) return blogPosts;
    return blogPosts.filter((post) => post.year === selectedYear);
  }, [selectedYear]);

  return (
    <div className="blog-page">
      <div className="blog-container">
        <div className="blog-header">
          <h1>Backstage Blog</h1>
          <p>Latest news, updates, and stories from the Backstage community.</p>
        </div>

        <div className="blog-content">
          <div className="blog-filters">
            <button
              className={`year-filter ${selectedYear === null ? 'active' : ''}`}
              onClick={() => setSelectedYear(null)}
            >
              All Years
            </button>
            {years.map((year) => (
              <button
                key={year}
                className={`year-filter ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="blog-posts">
            {filteredPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/posts/${post.slug}`}
                className="blog-post-card"
              >
                <div className="blog-post-date">{formatDate(post.date)}</div>
                <h2 className="blog-post-title">{post.title}</h2>
              </a>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <p>No blog posts found for this year.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
