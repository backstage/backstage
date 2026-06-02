import{ca as i,b6 as u,bR as t,B as o,cN as c,cQ as p}from"./iframe-DogXi1kP.js";import{i as m}from"./openLink-CxuZpafj.js";import{u as l}from"./useResolvedHref-BFQ7w248.js";function d(n){const{useAnalytics:e,children:a}=n,s=i.useMemo(()=>u({1:{useAnalytics:e}}),[e]),r=t.jsx(o.Provider,{value:s,children:a});return c()?t.jsx(g,{children:r}):r}function g({children:n}){const e=p();return t.jsx(m,{navigate:e,useHref:l,children:n})}d.__docgenInfo={description:`Provides integration capabilities to all descendant BUI components.

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
}`,signature:{properties:[{key:{name:"string"},value:{name:"union",raw:"string | boolean | number",elements:[{name:"string"},{name:"boolean"},{name:"number"}],required:!0}}]},required:!1}}]}},name:"options"}],return:{name:"void"}},required:!0}}]}}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{d as B};
