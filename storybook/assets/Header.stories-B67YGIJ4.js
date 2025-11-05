import{j as e}from"./iframe-CjPeRtpr.js";import{H as o}from"./Header-DNYiHj_T.js";import{P as p}from"./Page-CXCWxO8q.js";import{H as r}from"./HeaderLabel-fbVOTzDG.js";import"./preload-helper-D9Z9MdNV.js";import"./Helmet-BmGvJBW2.js";import"./Box-Clo5S76h.js";import"./styled-HkKxam_j.js";import"./Grid-C-Nq5_yH.js";import"./Breadcrumbs-Dvq-3uUK.js";import"./index-DnL3XN75.js";import"./Popover-CtBABBeq.js";import"./Modal-CJx3g85d.js";import"./Portal-DbRgE8W4.js";import"./List-viPECRg_.js";import"./ListContext-B6QifY9s.js";import"./ListItem-DXifIexk.js";import"./Link-C_RbsuLk.js";import"./lodash-CwBbdt2Q.js";import"./index-o3KEuSlS.js";import"./useAnalytics-CKVjVoDQ.js";import"./useApp-BDYwb5CO.js";import"./Page-CQLD4wFq.js";import"./useMediaQuery-Q-oGJBO-.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
