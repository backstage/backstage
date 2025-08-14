import{j as e}from"./jsx-runtime-hv06LKfz.js";import{r as b}from"./index-D8-PC79C.js";import{H as f}from"./Helmet-DZToxFkW.js";import{L as x}from"./Link-m8k68nLc.js";import{H as R}from"./HeaderTabs-RIU1cnEH.js";import{C as j}from"./Content-Dneo4nk4.js";import{e as g,f as L,m as v,M as E,R as P,a as w}from"./index-B7KODvs-.js";import{a as _}from"./componentData-DvKcogcx.js";import"./index-BKN9BsH4.js";import"./index-DlxYA1zJ.js";import"./lodash-D1GzKnrP.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./defaultTheme-NkpNA350.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./makeStyles-CJp8qHqH.js";import"./Typography-NhBf-tfS.js";import"./useApp-BOX1l_wP.js";import"./ApiRef-ByCJBjX1.js";import"./useAnalytics-Q-nz63z2.js";import"./ConfigApi-ij0WO1-Y.js";import"./Box-dSpCvcz2.js";import"./typography-Mwc_tj4E.js";import"./Tabs-BzQqeg8O.js";import"./ButtonBase-DXo3xcpP.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./index-DnL3XN75.js";import"./useTheme-Dk0AiudM.js";import"./KeyboardArrowRight-DSUp4RBh.js";function k(t){const o=g(),s=t.map(({path:n,children:d})=>({caseSensitive:!1,path:`${n}/*`,element:d})).sort((n,d)=>d.path.replace(/\/\*$/,"").localeCompare(n.path.replace(/\/\*$/,""))),u=L(s)??t[0]?.children;let a=o["*"]??"";a.startsWith("/")||(a=`/${a}`);const[i]=v(s,a)??[],p=i?t.findIndex(n=>`${n.path}/*`===i.route.path):0;return{index:p===-1?0:p,element:u,route:t[p]??t[0]}}function y(t){const{routes:o}=t,{index:r,route:s,element:u}=k(o),a=b.useMemo(()=>o.map(i=>{const{path:p,title:n,tabProps:d}=i;let l=p;return l=l.replace(/\/\*$/,""),l=l.replace(/^\//,""),{id:p,label:n,tabProps:{component:x,to:l,...d}}}),[o]);return e.jsxs(e.Fragment,{children:[e.jsx(R,{tabs:a,selectedIndex:r}),e.jsxs(j,{children:[e.jsx(f,{title:s?.title}),u]})]})}y.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;_(h,"core.gatherMountPoints",!0);function T(t){const o=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(r=>{if(!b.isValidElement(r))return[];if(r.type===b.Fragment)return T(r.props.children);if(r.type!==o)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:s,title:u,children:a,tabProps:i}=r.props;return[{path:s,title:u,children:a,tabProps:i}]})}function m(t){const o=T(t.children);return e.jsx(y,{routes:o})}m.Route=h;m.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const fe={title:"Navigation/TabbedLayout",component:m},C=({children:t})=>e.jsx(E,{children:e.jsx(P,{children:e.jsx(w,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),c=()=>e.jsx(C,{children:e.jsxs(m,{children:[e.jsx(m.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(m.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});c.__docgenInfo={description:"",methods:[],displayName:"Default"};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...c.parameters?.docs?.source}}};const xe=["Default"];export{c as Default,xe as __namedExportsOrder,fe as default};
