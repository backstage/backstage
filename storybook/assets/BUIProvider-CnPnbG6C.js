import{r,b as i,c as g,j as d}from"./iframe-a5iorYt_.js";function l(s){const{useAnalytics:o,useNavigation:u,children:c}=s,t=r.useContext(i),e=t?.atVersion(2),n=o??(e??t?.atVersion(1))?.useAnalytics,a=u??t?.atVersion(3)?.useNavigation,p=r.useMemo(()=>g({1:{useAnalytics:n},...e?{2:{...e,useAnalytics:n}}:{},3:{useAnalytics:n,useNavigation:a}}),[e,n,a]);return d.jsx(i.Provider,{value:p,children:c})}l.__docgenInfo={description:`Provides integration capabilities to all descendant BUI components.

An explicit host hook supplies navigation, href resolution, and active-state
detection, including for independently loaded BUI components. BUI components
bind this hook to React Aria at their own route scope. Without a host hook,
components use an explicitly supplied React Aria router or browser navigation.

React Aria components used directly need their own routing integration.

External links, downloads, and links with non-self targets use native browser
navigation. Components outside a routing context also use native links.

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
}`,signature:{properties:[{key:{name:"string"},value:{name:"union",raw:"string | boolean | number",elements:[{name:"string"},{name:"boolean"},{name:"number"}],required:!0}}]},required:!1}}]}},name:"options"}],return:{name:"void"}},required:!0}}]}}}},description:"Analytics hook. Inherits the enclosing provider when omitted."},useNavigation:{required:!1,tsType:{name:"signature",type:"function",raw:"() => BUINavigation",signature:{arguments:[],return:{name:"signature",type:"object",raw:`{
  /** Navigates to an authored target using the same scope as createHref. */
  navigate: (href: string, options?: BUINavigationOptions) => void;
  /** Returns a browser-ready href, leaving external targets unchanged. */
  createHref: (href: string) => string;
  /** Current browser pathname, including any deployment basename. */
  pathname: string;
}`,signature:{properties:[{key:"navigate",value:{name:"signature",type:"function",raw:"(href: string, options?: BUINavigationOptions) => void",signature:{arguments:[{type:{name:"string"},name:"href"},{type:{name:"signature",type:"object",raw:`{
  /** Replace the current history entry instead of adding one. */
  replace?: boolean;
  /** State associated with the destination history entry. */
  state?: unknown;
}`,signature:{properties:[{key:"replace",value:{name:"boolean",required:!1},description:"Replace the current history entry instead of adding one."},{key:"state",value:{name:"unknown",required:!1},description:"State associated with the destination history entry."}]}},name:"options"}],return:{name:"void"}},required:!0},description:"Navigates to an authored target using the same scope as createHref."},{key:"createHref",value:{name:"signature",type:"function",raw:"(href: string) => string",signature:{arguments:[{type:{name:"string"},name:"href"}],return:{name:"string"}},required:!0},description:"Returns a browser-ready href, leaving external targets unchanged."},{key:"pathname",value:{name:"string",required:!0},description:"Current browser pathname, including any deployment basename."}]}}}},description:`Hook called at each consuming component to bind navigation, href
resolution and the active pathname to that component's route scope.
When omitted, inherits an enclosing host hook. Without a host hook,
components use an explicitly supplied React Aria router or browser navigation.`},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};export{l as B};
