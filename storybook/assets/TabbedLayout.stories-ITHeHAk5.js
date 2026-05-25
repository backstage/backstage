import{r as b,j as e,a_ as f,a$ as x,b0 as R,M as g,a7 as j,a8 as L}from"./iframe-C23uhf86.js";import{H as v}from"./Helmet-DyAI1FC3.js";import{L as E}from"./Link-BTfSvZWa.js";import{H as P}from"./HeaderTabs-DqG3v-Dx.js";import{C as _}from"./Content-DANVLFbr.js";import{a as w}from"./componentData-BZ6And4s.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DzKqHxgJ.js";import"./lodash-DUhit4Jc.js";import"./useAnalytics-cDq5hBLc.js";import"./makeStyles-CpHXwfxK.js";import"./useApp-BqO9fDba.js";import"./Box-WThUmTfz.js";import"./styled-CWwxa9HM.js";import"./Tabs-GVNASjmU.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-zcdCMv15.js";function k(t){const a=f(),s=t.map(({path:n,children:m})=>({caseSensitive:!1,path:`${n}/*`,element:m})).sort((n,m)=>m.path.replace(/\/\*$/,"").localeCompare(n.path.replace(/\/\*$/,""))),d=x(s)??t[0]?.children;let r=a["*"]??"";r.startsWith("/")||(r=`/${r}`);const[i]=R(s,r)??[],p=i?t.findIndex(n=>`${n.path}/*`===i.route.path):0;return{index:p===-1?0:p,element:d,route:t[p]??t[0]}}function y(t){const{routes:a}=t,{index:o,route:s,element:d}=k(a),r=b.useMemo(()=>a.map(i=>{const{path:p,title:n,tabProps:m}=i;let l=p;return l=l.replace(/\/\*$/,""),l=l.replace(/^\//,""),{id:p,label:n,tabProps:{component:E,to:l,...m}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(P,{tabs:r,selectedIndex:o}),e.jsxs(_,{children:[e.jsx(v,{title:s?.title}),d]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;w(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(o=>{if(!b.isValidElement(o))return[];if(o.type===b.Fragment)return T(o.props.children);if(o.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:s,title:d,children:r,tabProps:i}=o.props;return[{path:s,title:d,children:r,tabProps:i}]})}function u(t){const a=T(t.children);return e.jsx(y,{routes:a})}u.Route=h;u.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const G={title:"Navigation/TabbedLayout",component:u,tags:["!manifest"]},C=({children:t})=>e.jsx(g,{children:e.jsx(j,{children:e.jsx(L,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),c=()=>e.jsx(C,{children:e.jsxs(u,{children:[e.jsx(u.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(u.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});c.__docgenInfo={description:"",methods:[],displayName:"Default"};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...c.parameters?.docs?.source}}};const K=["Default"];export{c as Default,K as __namedExportsOrder,G as default};
