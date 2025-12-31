import React from 'react';
import Theme, { Nav } from 'rspress/theme';
import { useLocation } from 'rspress/runtime';
import HomePage from '../../docs/index.tsx';
import PluginsPage from '../../docs/theme/pages/plugins.tsx';
import BlogPage from '../../docs/theme/pages/blog.tsx';
import '../../docs/theme/styles/home.css';
import '../../docs/theme/styles/plugins.css';
import '../../docs/theme/styles/blog.css';

const Layout = () => {
  const location = useLocation();

  // Check if we're on the home page
  if (location.pathname === '/' || location.pathname === '/index') {
    // Render just the Nav bar + full-width HomePage (no content container constraints)
    return (
      <div className="rspress-home-layout">
        <Nav />
        <main>
          <HomePage />
        </main>
      </div>
    );
  }

  // Check if we're on the plugins page
  if (location.pathname === '/plugins' || location.pathname === '/plugins/') {
    return (
      <div className="rspress-home-layout">
        <Nav />
        <main>
          <PluginsPage />
        </main>
      </div>
    );
  }

  // Check if we're on the blog index page
  if (location.pathname === '/blog' || location.pathname === '/blog/' || location.pathname === '/blog/index') {
    return (
      <div className="rspress-home-layout">
        <Nav />
        <main>
          <BlogPage />
        </main>
      </div>
    );
  }

  // Use default theme for all other pages
  return <Theme.Layout />;
};

export default {
  ...Theme,
  Layout,
};

export * from 'rspress/theme';
