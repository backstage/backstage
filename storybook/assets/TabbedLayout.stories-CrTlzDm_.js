import{r as c,j as e,a0 as f}from"./iframe-M9O-K8SB.js";import{H as x}from"./Helmet-BMcyM-lh.js";import{L as R}from"./Link-Btc0GL0z.js";import{H as L}from"./HeaderTabs-DEKigQC2.js";import{e as g,f as j,m as v,M as E,R as P,a as w}from"./index-CuiKZooy.js";import{a as _}from"./componentData-lwFigNXQ.js";import"./preload-helper-PPVm8Dsz.js";import"./lodash-Czox7iJy.js";import"./useAnalytics-8ya555GT.js";import"./useApp-Citse85p.js";import"./Box-DrVgjJoD.js";import"./styled-Ddkk_tuK.js";import"./Tabs-Ckm9dnSY.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-O5ZDR88r.js";function k(t){const a=g(),i=t.map(({path:s,children:l})=>({caseSensitive:!1,path:`${s}/*`,element:l})).sort((s,l)=>l.path.replace(/\/\*$/,"").localeCompare(s.path.replace(/\/\*$/,""))),m=j(i)??t[0]?.children;let r=a["*"]??"";r.startsWith("/")||(r=`/${r}`);const[p]=v(i,r)??[],u=p?t.findIndex(s=>`${s.path}/*`===p.route.path):0;return{index:u===-1?0:u,element:m,route:t[u]??t[0]}}function y(t){const{routes:a}=t,{index:n,route:i,element:m}=k(a),r=c.useMemo(()=>a.map(p=>{const{path:u,title:s,tabProps:l}=p;let b=u;return b=b.replace(/\/\*$/,""),b=b.replace(/^\//,""),{id:u,label:s,tabProps:{component:R,to:b,...l}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(L,{tabs:r,selectedIndex:n}),e.jsxs(f,{children:[e.jsx(x,{title:i?.title}),m]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;_(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return c.Children.toArray(t).flatMap(n=>{if(!c.isValidElement(n))return[];if(n.type===c.Fragment)return T(n.props.children);if(n.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:i,title:m,children:r,tabProps:p}=n.props;return[{path:i,title:m,children:r,tabProps:p}]})}function d(t){const a=T(t.children);return e.jsx(y,{routes:a})}d.Route=h;d.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const z={title:"Navigation/TabbedLayout",component:d,tags:["!manifest"]},S=({children:t})=>e.jsx(E,{children:e.jsx(P,{children:e.jsx(w,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),o=()=>e.jsx(S,{children:e.jsxs(d,{children:[e.jsx(d.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(d.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});o.__docgenInfo={description:"",methods:[],displayName:"Default"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const Default = () => (
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
  </Wrapper>`,...o.parameters?.docs?.source}}};const B=["Default"];export{o as Default,B as __namedExportsOrder,z as default};
