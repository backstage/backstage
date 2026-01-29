'use client';

import { useEffect, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './TableOfContents.module.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [indicatorTop, setIndicatorTop] = useState<number>(0);
  const [indicatorHeight, setIndicatorHeight] = useState<number>(0);
  const pathname = usePathname();

  // Update indicator position when activeId changes
  useLayoutEffect(() => {
    if (!activeId) return;
    
    // Use requestAnimationFrame to defer setState call
    const rafId = requestAnimationFrame(() => {
      const activeElement = document.querySelector(
        `[data-toc-id="${activeId}"]`,
      ) as HTMLElement;
      if (activeElement) {
        const list = activeElement.closest('ul');
        if (list) {
          const listRect = list.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();
          setIndicatorTop(elementRect.top - listRect.top);
          setIndicatorHeight(elementRect.height);
        }
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [activeId, headings]);

  useEffect(() => {
    // Extract all H2 and H3 headings from the document
    const elements = Array.from(
      document.querySelectorAll('h2[id], h3[id]'),
    ) as HTMLHeadingElement[];

    const headingData: Heading[] = elements.map(element => ({
      id: element.id,
      text: (element.textContent || '').replace('#', '').trim(),
      level: parseInt(element.tagName.substring(1)),
    }));

    // Set up IntersectionObserver to track visible headings
    const observerOptions = {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    elements.forEach(element => observer.observe(element));

    // Initialize headings and active ID after observer is set up
    requestAnimationFrame(() => {
      setHeadings(headingData);

      // Set initial active heading (first visible heading or first heading)
      if (headingData.length > 0) {
        const viewportTop = window.scrollY + 100; // offset for header
        const visibleHeading = elements.find(element => {
          const rect = element.getBoundingClientRect();
          return rect.top + window.scrollY >= viewportTop - 200;
        });
        setActiveId(visibleHeading?.id || headingData[0].id);
      }
    });

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [pathname]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without scrolling (already handled above)
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {indicatorHeight > 0 && (
          <div
            className={styles.indicator}
            style={{
              top: `${indicatorTop}px`,
              height: `${indicatorHeight}px`,
            }}
          />
        )}
        {headings.map((heading, index) => (
          <li
            key={`${heading.id}-${index}`}
            data-toc-id={heading.id}
            className={`${styles.item} ${
              heading.level === 3 ? styles.itemNested : ''
            } ${activeId === heading.id ? styles.itemActive : ''}`}
          >
            <button
              onClick={() => handleClick(heading.id)}
              className={styles.link}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
