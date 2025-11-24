import{j as e}from"./iframe-CJzL4cPn.js";import{H as o}from"./Header-DqcrJMoI.js";import{P as p}from"./Page-B9HPUsP-.js";import{H as r}from"./HeaderLabel-CvFGueZG.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-lGd-aPuq.js";import"./Box-Csalpl_F.js";import"./styled-f8cp2BHL.js";import"./Grid-BQVDj5Jb.js";import"./Breadcrumbs-3jEZ6ULt.js";import"./index-DnL3XN75.js";import"./Popover-DfyH4ojT.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./List-BYbAdUIJ.js";import"./ListContext-BHz-Qyxa.js";import"./ListItem-KhwlQec0.js";import"./Link-bUQVVVBw.js";import"./lodash-CwBbdt2Q.js";import"./index-DOHES8EM.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./Page-DdP_262g.js";import"./useMediaQuery-B6iTZuff.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
