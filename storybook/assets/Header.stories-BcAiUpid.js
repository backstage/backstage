import{j as e}from"./iframe-BFEEYdl1.js";import{H as o}from"./Header-DAR5HIhf.js";import{P as p}from"./Page-0VZY3eQt.js";import{H as r}from"./HeaderLabel-DxcyNRop.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BdGZzRpE.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./Grid-_pxMEZfk.js";import"./Breadcrumbs-DexWWurF.js";import"./index-DnL3XN75.js";import"./Popover-D3pRgrSn.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./ListItem-CoJRgtBh.js";import"./Link-BzkurKFl.js";import"./lodash-CwBbdt2Q.js";import"./index-DFzOTOJF.js";import"./useAnalytics-RL6zQB6E.js";import"./useApp-BQvOBI0y.js";import"./Page-M-DceSpF.js";import"./useMediaQuery-BXDzmvky.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
  type: string;
  title: string;
  subtitle: string;
}) => {
  const {
    type
  } = args;
  return <Page themeId={type}>
      <Header {...args}>{labels}</Header>
    </Page>;
}`,...t.parameters?.docs?.source}}};const R=["Default"];export{t as Default,R as __namedExportsOrder,N as default};
