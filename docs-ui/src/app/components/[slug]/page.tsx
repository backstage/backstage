import { components, layoutComponents } from '@/utils/data';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { default: Component } = await import(
    `@/content/components/${slug}.mdx`
  );

  return <Component />;
}

export function generateStaticParams() {
  const list = [...components, ...layoutComponents];

  return list.map(component => ({
    slug: component.slug,
  }));
}

export const dynamicParams = false;
