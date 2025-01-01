'use server';

import { cookies } from 'next/headers';

export async function setThemeCookie() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  if (theme?.value === 'dark') {
    cookieStore.set('theme', 'light');
  } else {
    cookieStore.set('theme', 'dark');
  }
}

export async function setVersionCookie() {
  const cookieStore = await cookies();
  const version = cookieStore.get('version');

  if (version?.value === 'v1') {
    cookieStore.set('version', 'v2');
  } else {
    cookieStore.set('version', 'v1');
  }
}
