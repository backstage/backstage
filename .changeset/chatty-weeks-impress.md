---
'@backstage/plugin-home': patch
---

Added a new Quick Start Card to `plugin-home`, which can display basic info to get users the info they need to onboard to the Catalog.

```
import { QuickStartCard } from '@backstage/plugin-home';
<QuickStartCard
  title="Onboarding to the Catalog"
  modalTitle="Onboarding Quick Start"
  docsLinkTitle="Learn more with getting started docs"
  docsLink="https://backstage.io/docs/getting-started"
  image={
    <img
      src={ContentImage}
      alt="quick start"
      width="100%"
      height="100%"
    />
  }
  cardDescription="Backstage system model will help you create new entities"
  video={
    <video
      controls
      preload="auto"
      poster={"./videoPoster.png"}
    >
      <source src={"OnboardingDemo.mp4"} type="video/mp4" />
    </video>
  }
  downloadImage={
    <Button
      href={QuickStartPDF}
      target={'_blank'}
      download={true}
    >
      Download infographic button
    </Button>
  }
/>
```

See the [storybook examples](https://backstage.io/storybook/?path=/story/plugins-home-components-quickstartcard--default)
