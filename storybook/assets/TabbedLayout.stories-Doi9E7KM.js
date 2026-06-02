import{ca as b,bR as e,cS as f,cU as x,bX as R,w as g,X as j,W as L}from"./iframe-DogXi1kP.js";import{H as v}from"./Helmet-BFILATfr.js";import{L as E}from"./Link-WtjewFfs.js";import{H as w}from"./HeaderTabs-Bzmj5xXn.js";import{C as P}from"./Content-C6CI0Gck.js";import{a as S}from"./componentData-Bwbss29D.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DefuoSXt.js";import"./lodash-Bl4KCeDg.js";import"./useAnalytics-DWMKXBU9.js";import"./makeStyles-Bkm64Dpi.js";import"./useApp-C6xgnwsj.js";import"./Box-CJxb0nPe.js";import"./styled-LVo_tic8.js";import"./Tabs-B2Uv5fbh.js";import"./index-B9sM2jn7.js";import"./KeyboardArrowRight-raMz7dAc.js";function _(t){const a=f(),s=t.map(({path:r,children:m})=>({caseSensitive:!1,path:`${r}/*`,element:m})).sort((r,m)=>m.path.replace(/\/\*$/,"").localeCompare(r.path.replace(/\/\*$/,""))),d=x(s)??t[0]?.children;let n=a["*"]??"";n.startsWith("/")||(n=`/${n}`);const[i]=R(s,n)??[],p=i?t.findIndex(r=>`${r.path}/*`===i.route.path):0;return{index:p===-1?0:p,element:d,route:t[p]??t[0]}}function y(t){const{routes:a}=t,{index:o,route:s,element:d}=_(a),n=b.useMemo(()=>a.map(i=>{const{path:p,title:r,tabProps:m}=i;let l=p;return l=l.replace(/\/\*$/,""),l=l.replace(/^\//,""),{id:p,label:r,tabProps:{component:E,to:l,...m}}}),[a]);return e.jsxs(e.Fragment,{children:[e.jsx(w,{tabs:n,selectedIndex:o}),e.jsxs(P,{children:[e.jsx(v,{title:s?.title}),d]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;S(h,"core.gatherMountPoints",!0);function T(t){const a=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(o=>{if(!b.isValidElement(o))return[];if(o.type===b.Fragment)return T(o.props.children);if(o.type!==a)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:s,title:d,children:n,tabProps:i}=o.props;return[{path:s,title:d,children:n,tabProps:i}]})}function u(t){const a=T(t.children);return e.jsx(y,{routes:a})}u.Route=h;u.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const B={title:"Navigation/TabbedLayout",component:u,tags:["!manifest"]},k=({children:t})=>e.jsx(g,{children:e.jsx(j,{children:e.jsx(L,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),c=()=>e.jsx(k,{children:e.jsxs(u,{children:[e.jsx(u.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(u.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});c.__docgenInfo={description:"",methods:[],displayName:"Default"};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...c.parameters?.docs?.source}}};const G=["Default"];export{c as Default,G as __namedExportsOrder,B as default};
