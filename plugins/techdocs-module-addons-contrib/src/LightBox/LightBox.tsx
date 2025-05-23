/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect } from 'react';
import { useShadowRootElements } from '@backstage/plugin-techdocs-react';
// @ts-ignore
import PhotoSwipeLightbox, { DataSource, ZoomLevel } from 'photoswipe/lightbox';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';
import './lightbox.css';

export const LightBoxAddon = () => {
  const images = useShadowRootElements<HTMLImageElement>(['img']);

  useEffect(() => {
    let dataSourceImages: DataSource | null = null;

    let lightbox: PhotoSwipeLightbox | null = new PhotoSwipeLightbox({
      pswpModule: PhotoSwipe,
      initialZoomLevel: 1,
      secondaryZoomLevel: (zoomLevelObject: ZoomLevel) => {
        // photoswipe/lightbox won't zoom the image further then the given width and height.
        // therefore we need to calculate the zoom factor needed to fit the complete image in the viewport manually.
        const imageWidth = zoomLevelObject.elementSize.x;
        const imageHeight = zoomLevelObject.elementSize.y;
        const viewportWidth = zoomLevelObject.panAreaSize.x;
        const viewportHeight = zoomLevelObject.panAreaSize.y;

        const widthScale = viewportWidth / imageWidth;
        const heightScale = viewportHeight / imageHeight;

        const scaleFactor = Math.min(widthScale, heightScale);
        return scaleFactor;
      },
      wheelToZoom: true,
      arrowPrevSVG:
        '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowBackIosIcon" aria-label="fontSize large"><path d="M11.67 3.87 9.9 2.1 0 12l9.9 9.9 1.77-1.77L3.54 12z"></path></svg>',
      arrowNextSVG:
        '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIosIcon" aria-label="fontSize large"><path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path></svg>',
      closeSVG:
        '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon" aria-label="fontSize large"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>',
      zoomSVG: `<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ZoomIcon" aria-label="fontSize large">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path><path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" id="photoswipe-zoom-icon-zoomin-path"></path><path d="M12 10H 7 V 9 H 12 Z" id="photoswipe-zoom-icon-zoomout-path">
        </svg>`,
    });

    images.forEach((image, index) => {
      image.onclick = () => {
        if (dataSourceImages === null) {
          dataSourceImages = images.map(dataSourceImage => {
            return {
              element: dataSourceImage,
              src: dataSourceImage.src,
              msrc: dataSourceImage.src,
              alt: dataSourceImage.alt,
              width: dataSourceImage.clientWidth,
              height: dataSourceImage.clientHeight,
            };
          });
        }
        lightbox?.loadAndOpen(index, dataSourceImages);
        return false;
      };
    });
    lightbox.init();

    return () => {
      lightbox?.destroy();
      lightbox = null;
    };
  }, [images]);

  return null;
};
