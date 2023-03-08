import React from 'react';

import nominateStyles from './nominate.module.scss';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { BannerSection } from '@site/src/components/bannerSection/bannerSection';
import { BannerSectionGrid } from '../../components/bannerSection/bannerSectionGrid';
import { ContentBlock } from '@site/src/components/contentBlock/contentBlock';

const Nominate = () => {
  return (
    <Layout>
      <div className={clsx(nominateStyles.nominatePage)}>
        <BannerSection greyBackground>
          <ContentBlock title={<h1>Contributor Spotlight nomination</h1>}>
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdiZ28O7vwHo6NrwirEzGSbuVyBANSv7ItHqRlgVvSz3Z5xqQ/viewform?embedded=true"
              allowFullScreen
            ></iframe>
          </ContentBlock>
        </BannerSection>
      </div>
    </Layout>
  );
};

export default Nominate;
