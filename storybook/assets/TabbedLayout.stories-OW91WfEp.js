import{r as b,j as e,a as x}from"./iframe-B6vHPHUS.js";import{H as f}from"./Helmet-DZTe_dyH.js";import{L as R}from"./Link-BCwjV0MZ.js";import{H as j}from"./HeaderTabs-ZmkY0seg.js";import{d as g,e as L,m as v,M as E,R as P,a as w}from"./index-CG8HQpK_.js";import{a as _}from"./componentData-Ck-liOWv.js";import"./preload-helper-D9Z9MdNV.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./Box-BsuLuKk6.js";import"./styled-BNzka1pC.js";import"./Tabs-C5A5Scu8.js";import"./index-DnL3XN75.js";import"./KeyboardArrowRight-Bbr1rybk.js";function k(t){const a=g(),s=t.map(({path:r,children:m})=>({caseSensitive:!1,path:`${r}/*`,element:m})).sort((r,m)=>m.path.replace(/\/\*$/,"").localeCompare(r.path.replace(/\/\*$/,""))),d=L(s)??t[0]?.children;let n=a["*"]??"";n.startsWith("/")||(n=`/${n}`);const[i]=v(s,n)??[],p=i?t.findIndex(r=>`${r.path}/*`===i.route.path):0;return{index:p===-1?0:p,element:d,route:t[p]??t[0]}}function y(t){const{routes:a}=t,{index:o,route:s,element:d}=k(a),n=b.useMemo(()=>a.map(i=>{const{path:p,title:r,tabProps:m}=i;let l=p;return l=l.replace(/\/\*$/,""),l=l.replace(/^\//,""),{id:p,label:r,tabProps:{component:R,to:l,...m}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(j,{tabs:n,selectedIndex:o}),e.jsxs(x,{children:[e.jsx(f,{title:s?.title}),d]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;_(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(o=>{if(!b.isValidElement(o))return[];if(o.type===b.Fragment)return T(o.props.children);if(o.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:s,title:d,children:n,tabProps:i}=o.props;return[{path:s,title:d,children:n,tabProps:i}]})}function u(t){const a=T(t.children);return e.jsx(y,{routes:a})}u.Route=h;u.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const z={title:"Navigation/TabbedLayout",component:u},S=({children:t})=>e.jsx(E,{children:e.jsx(P,{children:e.jsx(w,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),c=()=>e.jsx(S,{children:e.jsxs(u,{children:[e.jsx(u.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(u.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});c.__docgenInfo={description:"",methods:[],displayName:"Default"};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...c.parameters?.docs?.source}}};const B=["Default"];export{c as Default,B as __namedExportsOrder,z as default};
