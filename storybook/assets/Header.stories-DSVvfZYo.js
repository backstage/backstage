import{j as e}from"./iframe-t9H7a1GP.js";import{H as o}from"./Header-DDAKFOCW.js";import{P as p}from"./Page-BdUGIKQK.js";import{H as r}from"./HeaderLabel-koyFNiru.js";import"./preload-helper-PPVm8Dsz.js";import"./Helmet-B8O4tuTd.js";import"./Box-Ca_FhWzH.js";import"./styled-GR2b4kqg.js";import"./Grid-Cv9MyPTj.js";import"./makeStyles-D3euK8x9.js";import"./Breadcrumbs-CJajazUF.js";import"./index-B9sM2jn7.js";import"./Popover-C_-i1x2h.js";import"./Modal-BdWhQ_fv.js";import"./Portal-DcWiiunN.js";import"./List-0f6LLPdL.js";import"./ListContext-1ZEJeBTD.js";import"./ListItem-DkFcAkFQ.js";import"./Link-B3MFkp5k.js";import"./index-CuWwFMcz.js";import"./lodash-CR-8Qmjt.js";import"./useAnalytics-CPvjMD4k.js";import"./useApp-BO5_SDAO.js";import"./Page-CB7g6hq2.js";import"./useMediaQuery-q-eUIbsr.js";import"./Tooltip-4n2HrPms.js";import"./Popper-gP0R36E2.js";const R={title:"Layout/Header",component:o,argTypes:{type:{options:["home","tool","service","website","library","app","apis","documentation","other"],control:{type:"select"}}},tags:["!manifest"]},a=e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Owner",value:"players"}),e.jsx(r,{label:"Lifecycle",value:"Production"}),e.jsx(r,{label:"Tier",value:"Level 1"})]}),t=i=>{const{type:s}=i;return e.jsx(p,{themeId:s,children:e.jsx(o,{...i,children:a})})};t.args={type:"home",title:"This is a title",subtitle:"This is a subtitle"};t.__docgenInfo={description:"",methods:[],displayName:"Default",props:{type:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!0,tsType:{name:"string"},description:""}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`(args: {
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
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,R as default};
