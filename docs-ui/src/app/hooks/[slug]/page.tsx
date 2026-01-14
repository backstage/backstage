import { hooks } from '@/utils/data';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { default: Component } = await import(`@/content/hooks/${slug}.mdx`);

  return <Component />;
}

export function generateStaticParams() {
  const list = [...hooks];

  return list.map(hook => ({
    slug: hook.slug,
  }));
}

export const dynamicParams = false;
