import{j as e}from"./iframe-BNEamOZA.js";import{H as o}from"./Header-BTHB2jQi.js";import{P as p}from"./Page-BPY9QNlP.js";import{H as r}from"./HeaderLabel-BROSpsEr.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B2Di1mtj.js";import"./Box-3EsxCCm9.js";import"./styled-vJQyp9py.js";import"./Grid-CRwHHoKE.js";import"./Breadcrumbs-Bn_nAXlf.js";import"./index-B9sM2jn7.js";import"./Popover-8csDASer.js";import"./Modal-DO3msElT.js";import"./Portal-DTr3SEhf.js";import"./List-DzzgZbq5.js";import"./ListContext-XsugHlK5.js";import"./ListItem-ZNxVQ_73.js";import"./Link-CYOaEznZ.js";import"./lodash-Y_-RFQgK.js";import"./index-eWkqxFkm.js";import"./useAnalytics-CDZunouu.js";import"./useApp-D0ZSr7F9.js";import"./Page-PJ8MY3l8.js";import"./useMediaQuery-BOgobTs9.js";import"./Tooltip-Bujs_RiC.js";import"./Popper-DSZDidno.js";const N={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}}},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
