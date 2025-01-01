'use server';

import { cookies } from 'next/headers';

export async function setDefaultThemeCookie() {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');

  if (theme === undefined) {
    cookieStore.set('theme', 'light');
  }
}

export async function setDefaultVersionCookie() {
  const cookieStore = await cookies();
  const version = cookieStore.get('version');

  if (version === undefined) {
    cookieStore.set('version', 'v2');
  }
}
