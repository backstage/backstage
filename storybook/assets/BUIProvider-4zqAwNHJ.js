import{c8 as s,b4 as o,bQ as n,B as u}from"./iframe-Zd-YI-2K.js";import{B as c,b as p}from"./BUIRoutingProvider-C6YoxI9h.js";function l(t){const{useAnalytics:e,children:r}=t,a=s.useMemo(()=>o({1:{useAnalytics:e},2:{useAnalytics:e,routing:p}}),[e]),i=n.jsx(u.Provider,{value:a,children:r});return n.jsx(c,{children:i})}l.__docgenInfo={description:`Provides integration capabilities to all descendant BUI components.

When rendered inside the Backstage app router, BUI components use
client-side navigation for internal links. Relative destinations resolve
from the route of the component that renders the link, and the router
basename applies once.

External and scheme links, downloads, and links with non-self targets use the
browser's native navigation. BUI components rendered outside React Router use
native links without throwing.

@example
\`\`\`tsx
import { BUIProvider } from '@backstage/ui';
import { useAnalytics as useBackstageAnalytics } from '@backstage/core-plugin-api';

function App() {
  return (
    <BUIProvider useAnalytics={useBackstageAnalytics}>
      <AppContent />
    </BUIProvider>
  );
}
\`\`\`

@public`,methods:[],displayName:"BUIProvider",props:{useAnalytics:{required:!1,tsType:{name:"signature",type:"function",raw:"() => AnalyticsTracker",signature:{arguments:[],return:{name:"signature",type:"object",raw:`{
  captureEvent: (
    action: string,
    subject: string,
    options?: {
      value?: number;
      attributes?: AnalyticsEventAttributes;
    },
  ) => void;
}`,signature:{properties:[{key:"captureEvent",value:{name:"signature",type:"function",raw:`(
  action: string,
  subject: string,
  options?: {
    value?: number;
    attributes?: AnalyticsEventAttributes;
  },
) => void`,signature:{arguments:[{type:{name:"string"},name:"action"},{type:{name:"string"},name:"subject"},{type:{name:"signature",type:"object",raw:`{
  value?: number;
  attributes?: AnalyticsEventAttributes;
}`,signature:{properties:[{key:"value",value:{name:"number",required:!1}},{key:"attributes",value:{name:"signature",type:"object",raw:`{
  [key: string]: string | boolean | number;
}`,signature:{properties:[{key:{name:"string"},value:{name:"union",raw:"string | boolean | number",elements:[{name:"string"},{name:"boolean"},{name:"number"}],required:!0}}]},required:!1}}]}},name:"options"}],return:{name:"void"}},required:!0}}]}}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{l as B};
