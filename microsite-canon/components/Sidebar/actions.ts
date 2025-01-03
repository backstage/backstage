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

export async function setThemeNameCookie() {
  const cookieStore = await cookies();
  const themeName = cookieStore.get('theme-name');

  if (themeName?.value === 'legacy') {
    cookieStore.set('theme-name', 'default');
  } else {
    cookieStore.set('theme-name', 'legacy');
  }
}
