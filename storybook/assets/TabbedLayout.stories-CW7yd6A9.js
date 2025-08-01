import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{r as b}from"./index-CTjT7uj6.js";import{H as j}from"./Helmet-DPVyO7__.js";import{L as g}from"./Link-Bp-Lt7-P.js";import{H as L}from"./HeaderTabs-BBBy0DYs.js";import{C as v}from"./Content-BdusJaap.js";import{e as E,f as P,m as w,M as _,R as k,a as C}from"./index-w6SBqnNd.js";import{a as S}from"./componentData-B20g3K9Y.js";import"./index-BRV0Se7Z.js";import"./index-Cqve-NHl.js";import"./lodash-CoGan1YB.js";import"./index-DwHHXP4W.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./makeStyles-3WuthtJ7.js";import"./Typography-CUBppVl0.js";import"./useAnalytics-DVyBXs_0.js";import"./ApiRef-CqkoWjZn.js";import"./ConfigApi-D1qiBdfc.js";import"./Box-BZcLdGyY.js";import"./typography-hVTC7Hfk.js";import"./Tabs-oEo5ac4L.js";import"./ButtonBase-C1iu_4vV.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./react-is.production.min-D0tnNtx9.js";import"./useTheme-hfNS2WFw.js";import"./KeyboardArrowRight-B8I4OV05.js";function $(t){var c;const o=E(),n=t.map(({path:i,children:r})=>({caseSensitive:!1,path:`${i}/*`,element:r})).sort((i,r)=>r.path.replace(/\/\*$/,"").localeCompare(i.path.replace(/\/\*$/,""))),d=P(n)??((c=t[0])==null?void 0:c.children);let s=o["*"]??"";s.startsWith("/")||(s=`/${s}`);const[p]=w(n,s)??[],m=p?t.findIndex(i=>`${i.path}/*`===p.route.path):0;return{index:m===-1?0:m,element:d,route:t[m]??t[0]}}function x(t){const{routes:o}=t,{index:a,route:n,element:d}=$(o),s=b.useMemo(()=>o.map(p=>{const{path:m,title:c,tabProps:i}=p;let r=m;return r=r.replace(/\/\*$/,""),r=r.replace(/^\//,""),{id:m,label:c,tabProps:{component:g,to:r,...i}}}),[o]);return e.jsxs(e.Fragment,{children:[e.jsx(L,{tabs:s,selectedIndex:a}),e.jsxs(v,{children:[e.jsx(j,{title:n==null?void 0:n.title}),d]})]})}x.__docgenInfo={description:"",methods:[],displayName:"RoutedTabs",props:{routes:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  path: string;
  title: string;
  children: JSX.Element;
  tabProps?: TabProps<ElementType, { component?: ElementType }>;
}`,signature:{properties:[{key:"path",value:{name:"string",required:!0}},{key:"title",value:{name:"string",required:!0}},{key:"children",value:{name:"JSX.Element",required:!0}},{key:"tabProps",value:{name:"TabProps",elements:[{name:"ElementType"},{name:"signature",type:"object",raw:"{ component?: ElementType }",signature:{properties:[{key:"component",value:{name:"ElementType",required:!1}}]}}],raw:"TabProps<ElementType, { component?: ElementType }>",required:!1}}]}}],raw:"SubRoute[]"},description:""}}};const h=()=>null;S(h,"core.gatherMountPoints",!0);function R(t){const o=e.jsx(h,{path:"",title:"",children:e.jsx("div",{})}).type;return b.Children.toArray(t).flatMap(a=>{if(!b.isValidElement(a))return[];if(a.type===b.Fragment)return R(a.props.children);if(a.type!==o)throw new Error("Child of TabbedLayout must be an TabbedLayout.Route");const{path:n,title:d,children:s,tabProps:p}=a.props;return[{path:n,title:d,children:s,tabProps:p}]})}function u(t){const o=R(t.children);return e.jsx(x,{routes:o})}u.Route=h;u.__docgenInfo={description:`TabbedLayout is a compound component, which allows you to define a layout for
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
\`\`\``,methods:[{name:"Route",docblock:null,modifiers:["static"],params:[],returns:null}],displayName:"TabbedLayout"};const xe={title:"Navigation/TabbedLayout",component:u},q=({children:t})=>e.jsx(_,{children:e.jsx(k,{children:e.jsx(C,{path:"/*",element:e.jsx(e.Fragment,{children:t})})})}),l=()=>e.jsx(q,{children:e.jsxs(u,{children:[e.jsx(u.Route,{path:"/",title:"tabbed-test-title",children:e.jsx("div",{children:"tabbed-test-content"})}),e.jsx(u.Route,{path:"/some-other-path",title:"tabbed-test-title-2",children:e.jsx("div",{children:"tabbed-test-content-2"})})]})});l.__docgenInfo={description:"",methods:[],displayName:"Default"};var y,T,f;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`() => <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>`,...(f=(T=l.parameters)==null?void 0:T.docs)==null?void 0:f.source}}};const Re=["Default"];export{l as Default,Re as __namedExportsOrder,xe as default};
