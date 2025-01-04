import { cookies } from 'next/headers';
import { Frame } from './frame';

interface StoryProps {
  id: string;
  border?: boolean;
}

export const Story = async ({ id, border = true }: StoryProps) => {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme');
  const localTheme = theme?.value === 'dark' ? 'Dark' : 'Light';
  const chromaticId = '67584b7e8c2eb09c0422c27e-dmfbzicnkw';
  const chromaticUrl = `https://${chromaticId}.chromatic.com/iframe.html`;
  const localUrl = 'http://localhost:6006/iframe.html';
  const url = process.env.NODE_ENV === 'development' ? localUrl : chromaticUrl;
  const iframeUrl = `${url}?globals=theme%3A${localTheme}&args=&id=${id}`;

  return <Frame url={iframeUrl} border={border} />;
};
