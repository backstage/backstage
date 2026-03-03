/*
 * Copyright 2020 The Backstage Authors
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

import { PropsWithChildren } from 'react';
import { GaugeCard } from './GaugeCard';
import { MemoryRouter } from 'react-router-dom';
import { Info } from 'lucide-react';
import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';

const linkInfo = { title: 'Go to XYZ Location', link: '#' };

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <MemoryRouter>
    <TooltipProvider>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {children}
      </div>
    </TooltipProvider>
  </MemoryRouter>
);

export default {
  title: 'Data Display/Progress Card',
  component: GaugeCard,
  tags: ['!manifest'],
};

export const Default = () => (
  <Wrapper>
    <div>
      <GaugeCard title="Progress" progress={0.3} />
    </div>
    <div>
      <GaugeCard title="Progress" progress={0.57} />
    </div>
    <div>
      <GaugeCard title="Progress" progress={0.89} />
    </div>
    <div>
      <GaugeCard title="Progress" inverse progress={0.2} />
    </div>
  </Wrapper>
);

export const Subhead = () => (
  <Wrapper>
    <div>
      <GaugeCard title="Progress" subheader="With a subheader" progress={0.3} />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        progress={0.57}
      />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        progress={0.89}
      />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        inverse
        progress={0.2}
      />
    </div>
  </Wrapper>
);

export const LinkInFooter = () => (
  <Wrapper>
    <div>
      <GaugeCard title="Progress" deepLink={linkInfo} progress={0.3} />
    </div>
    <div>
      <GaugeCard title="Progress" deepLink={linkInfo} progress={0.57} />
    </div>
    <div>
      <GaugeCard title="Progress" deepLink={linkInfo} progress={0.89} />
    </div>
    <div>
      <GaugeCard title="Progress" deepLink={linkInfo} inverse progress={0.2} />
    </div>
  </Wrapper>
);

export const StaticColor = () => (
  <Wrapper>
    <div>
      <GaugeCard getColor={() => '#f00'} title="Red" progress={0.5} />
    </div>
    <div>
      <GaugeCard getColor={() => '#0f0'} title="Green" progress={0.5} />
    </div>
    <div>
      <GaugeCard getColor={() => '#00f'} title="Blue" progress={0.5} />
    </div>
    <div>
      <GaugeCard
        getColor={({ palette }) => palette.status.error}
        title="palette.status.error"
        progress={0.5}
      />
    </div>
  </Wrapper>
);

export const InfoMessage = () => (
  <Wrapper>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        progress={0.3}
        icon={
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span className="float-right cursor-pointer">
                <Info className="h-5 w-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Info Message</TooltipContent>
          </ShadcnTooltip>
        }
      />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        progress={0.57}
        icon={
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span className="float-right cursor-pointer">
                <Info className="h-5 w-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Info Message</TooltipContent>
          </ShadcnTooltip>
        }
      />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        progress={0.89}
        icon={
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span className="float-right cursor-pointer">
                <Info className="h-5 w-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Info Message</TooltipContent>
          </ShadcnTooltip>
        }
      />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        subheader="With a subheader"
        inverse
        progress={0.2}
        icon={
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <span className="float-right cursor-pointer">
                <Info className="h-5 w-5 text-muted-foreground" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Info Message</TooltipContent>
          </ShadcnTooltip>
        }
      />
    </div>
  </Wrapper>
);

export const AlignedBottom = () => (
  <Wrapper>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        title="Progress"
        subheader="With a subheader"
        progress={0.3}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        title="Progress"
        subheader="With a subheader"
        progress={0.57}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        title="Progress with longer title"
        subheader="With a subheader"
        progress={0.89}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        title="Progress"
        subheader="With a subheader"
        inverse
        progress={0.2}
      />
    </div>
  </Wrapper>
);

export const Small = () => (
  <Wrapper>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        size="small"
        title="Progress"
        progress={0.3}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        size="small"
        title="Progress"
        subheader="With a subheader"
        progress={0.57}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        size="small"
        title="Progress, longer title"
        progress={0.89}
      />
    </div>
    <div>
      <GaugeCard
        variant="fullHeight"
        alignGauge="bottom"
        size="small"
        title="Progress"
        inverse
        progress={0.2}
      />
    </div>
  </Wrapper>
);

export const HoverMessage = () => (
  <Wrapper>
    <div>
      <GaugeCard title="Progress" progress={0.3} description="Hover Message" />
    </div>
    <div>
      <GaugeCard title="Progress" progress={0.57} description="Hover Message" />
    </div>
    <div>
      <GaugeCard title="Progress" progress={0.89} description="Hover Message" />
    </div>
    <div>
      <GaugeCard
        title="Progress"
        inverse
        progress={0.2}
        description="Hover Message"
      />
    </div>
  </Wrapper>
);
