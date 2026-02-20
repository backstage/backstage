import{r as c,j as e}from"./iframe-CXVefQjv.js";import{H as f}from"./Helmet-CNf04HDu.js";import{L as x}from"./Link-R8tlL6vJ.js";import{H as R}from"./HeaderTabs-CHXDqFld.js";import{C as L}from"./Content-Cp4KP6Uw.js";import{e as g,f as j,m as v,M as E,R as P,a as w}from"./index-B97xvfin.js";import{a as _}from"./componentData-CjALqQ4I.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CROf0-mb.js";import"./lodash-DZtYjLW6.js";import"./makeStyles-cSB5pDml.js";import"./useAnalytics-Bx4_U39Z.js";import"./useApp-DMj12Ulj.js";import"./Box-D7AnzI4p.js";import"./styled-B7NpzSmh.js";import"./Tabs-CQgmpBMD.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-BolqjStM.js";function k(t){const a=g(),i=t.map(({path:s,children:l})=>({caseSensitive:!1,path:`${s}/*`,element:l})).sort((s,l)=>l.path.replace(/\/\*$/,"").localeCompare(s.path.replace(/\/\*$/,""))),m=j(i)??t[0]?.children;let n=a["*"]??"";n.startsWith("/")||(n=`/${n}`);const[p]=v(i,n)??[],u=p?t.findIndex(s=>`${s.path}/*`===p.route.path):0;return{index:u===-1?0:u,element:m,route:t[u]??t[0]}}function y(t){const{routes:a}=t,{index:r,route:i,element:m}=k(a),n=c.useMemo(()=>a.map(p=>{const{path:u,title:s,tabProps:l}=p;let b=u;return b=b.replace(/\/\*$/,""),b=b.replace(/^\//,""),{id:u,label:s,tabProps:{component:x,to:b,...l}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(R,{tabs:n,selectedIndex:r}),e.jsxs(L,{children:[e.jsx(f,{title:i?.title}),m]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;_(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return c.Children.toArray(t).flatMap(r=>{if(!c.isValidElement(r))return[];if(r.type===c.Fragment)return T(r.props.children);if(r.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:i,title:m,children:n,tabProps:p}=r.props;return[{path:i,title:m,children:n,tabProps:p}]})}function d(t){const a=T(t.children);return e.jsx(y,{routes:a})}d.Route=h;d.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
pages using a sub-navigation mechanism.

@remarks
Consists of two parts: TabbedLayout and TabbedLayout.Route

@example
\`\`\`jsx
<TabbedLayout>
  <TabbedLayout.Route path="/example" title="Example tab">
    <div>This is rendered under /example/anything-here route</div>
  </TabbedLayout.Route>
</TabbedLayout>
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const K={title:"Navigation/TabbedLayout",component:d,tags:["!manifest"]},C=({children:t})=>e.jsx(E,{children:e.jsx(P,{children:e.jsx(w,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),o=()=>e.jsx(C,{children:e.jsxs(d,{children:[e.jsx(d.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(d.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});o.__docgenInfo={description:"",methods:[],displayName:"Default"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const Default = () => (
  <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>
);
`,...o.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...o.parameters?.docs?.source}}};const Q=["Default"];export{o as Default,Q as __namedExportsOrder,K as default};
