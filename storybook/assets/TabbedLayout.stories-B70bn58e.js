import{r as b,j as e,aX as f,aY as x,aZ as R,M as g,a4 as j,a5 as L}from"./iframe-Pg_F-I9L.js";import{H as v}from"./Helmet-53BqrsGd.js";import{L as E}from"./Link-CtDLnTRC.js";import{H as P}from"./HeaderTabs-Dos8N7pM.js";import{C as w}from"./Content-BrCw3ejm.js";import{a as _}from"./componentData-Wy1DYnF8.js";import"./preload-helper-PPVm8Dsz.js";import"./index-M3sqaKV4.js";import"./lodash-B6WwamON.js";import"./useAnalytics-DLzqrBGl.js";import"./makeStyles-Cbx_09Po.js";import"./useApp-Dqd5lgHs.js";import"./Box-203OJvOv.js";import"./styled-CAdW7jEY.js";import"./Tabs-DrP3lF6Y.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-BhWKqvGi.js";function k(t){const a=f(),s=t.map(({path:n,children:m})=>({caseSensitive:!1,path:`${n}/*`,element:m})).sort((n,m)=>m.path.replace(/\/\*$/,"").localeCompare(n.path.replace(/\/\*$/,""))),d=x(s)??t[0]?.children;let r=a["*"]??"";r.startsWith("/")||(r=`/${r}`);const[i]=R(s,r)??[],p=i?t.findIndex(n=>`${n.path}/*`===i.route.path):0;return{index:p===-1?0:p,element:d,route:t[p]??t[0]}}function y(t){const{routes:a}=t,{index:o,route:s,element:d}=k(a),r=b.useMemo(()=>a.map(i=>{const{path:p,title:n,tabProps:m}=i;let l=p;return l=l.replace(/\/\*$/,""),l=l.replace(/^\//,""),{id:p,label:n,tabProps:{component:E,to:l,...m}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(P,{tabs:r,selectedIndex:o}),e.jsxs(w,{children:[e.jsx(v,{title:s?.title}),d]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;_(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(o=>{if(!b.isValidElement(o))return[];if(o.type===b.Fragment)return T(o.props.children);if(o.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:s,title:d,children:r,tabProps:i}=o.props;return[{path:s,title:d,children:r,tabProps:i}]})}function u(t){const a=T(t.children);return e.jsx(y,{routes:a})}u.Route=h;u.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const z={title:"Navigation/TabbedLayout",component:u,tags:["!manifest"]},C=({children:t})=>e.jsx(g,{children:e.jsx(j,{children:e.jsx(L,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),c=()=>e.jsx(C,{children:e.jsxs(u,{children:[e.jsx(u.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(u.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});c.__docgenInfo={description:"",methods:[],displayName:"Default"};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...c.parameters?.docs?.source}}};const B=["Default"];export{c as Default,B as __namedExportsOrder,z as default};
